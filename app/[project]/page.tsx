"use client";

import React from 'react';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@supabase/supabase-js";
import { BatteryFull, Coins, Mic, Play, Square, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Coin } from "../components/coin/Coin";
import path from 'path';
const isPlayedLocally: Record<string, boolean> = {};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Add this function before your component
const listenToVoiceUpdates = (callback: (updatedVoice: any) => void) => {
  // Implement your voice update listening logic here
  // This is a placeholder implementation
  const intervalId = setInterval(() => {
    // Simulate voice updates
    callback({ id: Date.now(), message: 'New voice update' });
  }, 5000);

  // Return a function to unsubscribe
  return () => clearInterval(intervalId);
};

// Create AudioContext outside of the component
const getAudioContext = () => {
  if (typeof window !== 'undefined') {
    return new (window.AudioContext || window.webkitAudioContext)();
  }
  return null;
};


const updateVoiceStatus = async (voiceId: string, isPlayed: boolean) => {
  try {
    const { error } = await supabase
      .from('voice_logs')
      .update({ is_played: isPlayed })
      .eq('id', voiceId)

    if (error) throw error
  } catch (error) {
    console.error('Error updating voice status:', error)
  }
}

export default function ProjectDetails() {
  const [amount, setAmount] = useState("0.0");

  const accumulatedPoints = useRef(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentBatteryWithRef = useRef(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTapping, setIsTapping] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [displayedPoints, setDisplayedPoints] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentBattery, setCurrentBattery] = useState(1000);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceQueue, setVoiceQueue] = useState<Set<any>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const playVoice = async (voice: { voice_url: string; id: string }, audioContext: AudioContext) => {
    if (isPlayedLocally[voice.id]) {
      isPlayingRef.current = false;
      console.log("voice already played locally")
      return
    }
    isPlayedLocally[voice.id] = true
    const response = await fetch(voice.voice_url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
  
    return new Promise<void>((resolve) => {
      source.onended = () => resolve();
      source.start();
    });
  };
  
  useEffect(() => {
    // Initialize audioContext here if it hasn't been already
    console.log("audioContext", audioContext)
    if (!audioContext) {
      setAudioContext(getAudioContext());
    }
  }, []);
  
  const fetchUnplayedVoices = useCallback(async () => {
    const { data, error } = await supabase
      .from('voice_logs')
      .select('*')
      .eq('is_played', false)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching voice logs:', error);
    } else if (data) {
      console.log('Fetched unplayed voice logs:', data);
      setVoiceQueue(prevQueue => {
        const queueArray = [...prevQueue];
        // Remove the first (played) voice if the queue is not empty
        if (queueArray.length > 0) {
          queueArray.shift();
        }
        // Add new unique voices
        const newVoices = data.filter((voice: { id: string }) => !queueArray.some(queueVoice => queueVoice.id === voice.id));
        return new Set([...queueArray, ...newVoices]);
      });
    }
  }, []);

  const playNextVoice = async () => {
    if (isPlayingRef.current || voiceQueue.size === 0) return;

    isPlayingRef.current = true;
    const [nextVoice] = voiceQueue;
    console.log("nextVoice", nextVoice, "voiceQueue size = ", voiceQueue.size)
    if (!nextVoice.is_played) {
      try {
        if (!audioContext) {
          throw new Error("AudioContext not initialized");
        }
        await playVoice(nextVoice, audioContext);
        await updateVoiceStatus(nextVoice.id, true);
        console.log("yoooo")
        setVoiceQueue(prev => {
          const updated = new Set(prev);
          updated.delete(nextVoice);
          return updated;
        });


      } catch (error) {
        console.error('Error playing voice:', error);
      }
    }

    setVoiceQueue(prev => {
      const updated = new Set(prev);
      updated.delete(nextVoice);
      return updated;
    });

    isPlayingRef.current = false;

    // Check if the voice queue is empty after playing
    if (voiceQueue.size <= 1) {  // Size will be 1 because we haven't removed the current voice yet
      console.log("Voice queue is now empty. Stopping playback.");
      isPlayingRef.current = false;
      setIsPlaying(false);
      return;  // Exit the function to stop further playback
    }
    else playNextVoice(); // Try to play the next voice
  };

  // Call this when a new voice is added to the queue
  useEffect(() => {
    console.log("voiceQueue.size = ", voiceQueue.size, [...voiceQueue], "isPlayingRef.current = ", isPlayingRef.current)
    if (voiceQueue.size > 0 && !isPlayingRef.current) {
      playNextVoice();
    }
  }, [voiceQueue]);

  useEffect(() => {
    fetchUnplayedVoices();

    const subscription = supabase
      .channel('voice_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'voice_logs' }, (payload: any) => {
        console.log('New voice log inserted:', payload); // Add this line
        if (payload.new && payload.new.is_played === false) {
          setVoiceQueue(prevQueue => {
            const updatedQueue = new Set([...prevQueue, payload.new]);
            console.log('Updated voice queue:', [...updatedQueue]);
            return updatedQueue;
          })

          console.log("isPlayingRef.current = ", isPlayingRef.current)
          // if (!isPlayingRef.current) {
          //   playNextVoice();
          // }
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      isPlayingRef.current = false;
    };
  }, [fetchUnplayedVoices]);

  // const startPlayingVoices = () => {
  //   console.log('startPlayingVoices called'); // Add this line
  //   setIsPlaying(true);
  //   isPlayingRef.current = true;
  //   playNextVoice();
  // };

  const handleClick = useCallback(() => {
    playSiu()
    const clickValue = 1;
    setIsTapping(true);
    // farmDetails!.current_settled_point += clickValue;
    setDisplayedPoints((prev) => prev + clickValue);
    accumulatedPoints.current += clickValue;
    setCurrentBattery((prev) => Math.max(1, prev - clickValue));
    // debouncedAddPoints();
  }, []);

  const startRecording = useCallback(async () => {
    audioChunksRef.current = [];
    setAudioUrl(null);
    setAudioBlob(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log("Audio data received:", event.data);
        }
      };

      mediaRecorderRef.current.start();
      console.log("Recording started");
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing the microphone", error);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      console.log("Recording stopped");
    }
    // Remove the sleep and playAudio call
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // playAudio();
  }, [isRecording]);

  // Add this new function to handle the blob upload
  const uploadBlob = async (blob: Blob) => {
    try {
      const fileName = `voice_recording_${Date.now()}.webm`;
      const { data, error } = await supabase.storage
        .from("voice-chant-files")
        .upload(fileName, blob);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("voice-chant-files").getPublicUrl(fileName);

      const userId = "0x2d7e2DF65C1B06fa60FAf2a7D4C260738BB553D9";
      const projectId = "2925e7b9-5251-4b07-9de9-0764c6b644eb";
      const { error: insertError } = await supabase.from("voice_logs").insert({
        user_address: userId,
        project_id: projectId,
        voice_url: publicUrl,
        created_at: new Date().toISOString(),
        is_played: false,
      });

      if (insertError) {
        console.error("Error inserting voice log:", insertError);
      }

      console.log("File uploaded successfully. Public URL:", publicUrl);
    } catch (error) {
      console.error("Error uploading file or inserting record:", error);
    }
  };

  useEffect(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {
        console.log("MediaRecorder stopped, processing audio...");
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
        console.log("Audio URL created:", url);
        // Attempt to play audio
        uploadBlob(blob)
        const audio = new Audio(url);
        audio.oncanplaythrough = () => {
          console.log("Audio is ready to play");
          audio.play().catch((e) => console.error("Error playing audio:", e));
        };
        audio.onerror = (e) => console.error("Error loading audio:", e);
      };
    }
  }, [mediaRecorderRef.current]);

  const playSiu = useCallback(() => {
    const audio = new Audio("/SiuChant.webm");
    audio.oncanplaythrough = () => {
      console.log("Playing audio...");
      audio.play().catch((e) => console.error("Error playing audio:", e));
    };
    audio.onerror = (e) => console.error("Error loading audio:", e);
  }, []);

  const playAudio = useCallback(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.oncanplaythrough = () => {
        console.log("Playing audio...");
        audio.play().catch((e) => console.error("Error playing audio:", e));
      };
      audio.onerror = (e) => console.error("Error loading audio:", e);
    } else {
      console.log("No audio to play");
    }
  }, [audioUrl]);

  const uploadToSupabase = useCallback(async () => {
    if (!audioBlob) {
      console.error("No audio to upload");
      return;
    }

    try {
      // Upload file to Supabase Storage
      const fileName = `voice_recording_${Date.now()}.webm`;
      const { data, error } = await supabase.storage
        .from("voice-chant-files")
        .upload(fileName, audioBlob);

      if (error) throw error;

      // Get public URL of the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("voice-chant-files").getPublicUrl(fileName);

      // Insert log into voice_logs table
      const userId = "0x2d7e2DF65C1B06fa60FAf2a7D4C260738BB553D9";
      const projectId = "2925e7b9-5251-4b07-9de9-0764c6b644eb";
      const { error: insertError } = await supabase.from("voice_logs").insert({
        user_address: userId, // Assuming you have the user's ID
        project_id: projectId, // Assuming you have the project ID
        voice_url: publicUrl,
        created_at: new Date().toISOString(),
        is_played: false,
        // Add other fields as necessary based on your schema
      });

      if (insertError) {
        console.error("Error inserting voice log:", insertError);
        // Handle the error appropriately
      }

      console.log("File uploaded successfully. Public URL:", publicUrl);

      console.log("Record inserted successfully:", data);
    } catch (error) {
      console.error("Error uploading file or inserting record:", error);
    }
  }, [audioBlob]);

  // useEffect(() => {
  //   const unsubscribe = listenToVoiceUpdates((updatedVoice) => {
  //     setVoiceQueue(prevQueue => {
  //       const updatedQueue = new Set([...prevQueue]);
  //       for (const voice of updatedQueue) {
  //         if (voice.id === updatedVoice.id) {
  //           if (updatedVoice.is_played) {
  //             updatedQueue.delete(voice);
  //           } else {
  //             updatedQueue.delete(voice);
  //             updatedQueue.add(updatedVoice);
  //           }
  //           break;
  //         }
  //       }
  //       return updatedQueue;
  //     });
  //   });

  //   return () => unsubscribe();
  // }, []);

  return (
    <Tabs defaultValue="tap">
      <div className="flex flex-col min-h-screen text-foreground">
        <TabsContent
          value="tap"
          className="flex flex-col items-center justify-center flex-grow overflow-hidden"
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <Coins className="h-full" />
              {/* <h1 className="text-4xl sm:text-5xl text-transparent bg-clip-text text-gradient-to-r from-blue-700 via-orange-600 to-green-600">{displayedPoints}</h1> */}
              <h1 className="text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-orange-600 to-green-600">
                69,420
              </h1>
            </div>
          </div>

          <div className="flex justify-center">
            <Coin
              canIClickPlease={true}
              sleep={false}
              funMode={true}
              clickValue={1}
              cooldown={1}
              handleClick={handleClick}
            />
          </div>

          <div className="pt-6 sm:pt-10 sm:mb-8 flex justify-center">
            <div className="flex items-center justify-center space-x-2">
              <BatteryFull className="h-full" />
              <span className="text-lg sm:text-xl font-bold">1000/1000</span>
            </div>
          </div>

          <div className="w-full px-4 mt-4">
            {/* <Progress value={currentBattery} className="w-full" /> */}
            <Progress value={69} className="w-full" />
          </div>

          <div className="w-full px-4 mt-8 flex flex-col items-center">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-full ${
                isRecording
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } hover:bg-opacity-80 transition-colors`}
            >
              {isRecording ? <Square size={24} /> : <Mic size={24} />}
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
            {/* {audioUrl && (
              <>
                <button onClick={playAudio}>
                  <Play size={24} /> Play Audio
                </button>
                <button onClick={uploadToSupabase}>
                  <Upload size={24} /> Upload to Supabase
                </button>
              </>
            )} */}
          </div>
        </TabsContent>

        <TabsContent
          value="trade"
          className="overflow-y-auto overflow-x-hidden flex-grow"
        >
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-green-500 text-base sm:text-lg">
                Market cap: $4,278,531
              </h2>
              <div className="flex items-center bg-amber-600 rounded p-2 mt-2 text-white">
                <span className="mr-2">CA:</span>
                <span className="flex-1 truncate text-xs sm:text-sm">
                  0xfbF4b007958B9419CC6a714aCF5561840154FA54
                </span>
              </div>
            </div>

            <Card className="rounded-none">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                  <Button className="bg-green-500 hover:bg-green-600 text-sm sm:text-base">
                    Buy
                  </Button>
                  <Button variant="outline" className="text-sm sm:text-base">
                    Sell
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4"></div>
                <div className="relative mb-4">
                  <Input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-16 text-sm sm:text-base"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm sm:text-base">
                    ETH
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount("0.01")}
                    className="text-xs sm:text-sm"
                  >
                    0.01 ETH
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount("0.05")}
                    className="text-xs sm:text-sm"
                  >
                    0.05 ETH
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount("0.1")}
                    className="text-xs sm:text-sm"
                  >
                    0.1 ETH
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount("0.3")}
                    className="text-xs sm:text-sm"
                  >
                    0.3 ETH
                  </Button>
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-sm sm:text-base">
                  place trade
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <footer className="p-2 sticky bottom-0 w-full">
          <TabsList className="sticky bottom-0 w-full bg-foreground">
            <TabsTrigger value="tap" className="w-full">
              Tap
            </TabsTrigger>
            <TabsTrigger value="trade" className="w-full">
              Trade
            </TabsTrigger>
          </TabsList>
        </footer>

        {voiceQueue.size > 0 && !isPlaying && (
          <div className="fixed bottom-20 right-4">
            <Button onClick={playNextVoice} className="bg-blue-500 hover:bg-blue-600">
              New incoming voice chant ({voiceQueue.size})
            </Button>
          </div>
        )}
      </div>
    </Tabs>
  );
}