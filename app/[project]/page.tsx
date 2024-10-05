"use client";

import React, { useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@supabase/supabase-js";
import {
  Battery,
  BatteryFull,
  ChevronDown,
  Coins,
  Copy,
  Mic,
  Play,
  Square,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Coin } from "../components/coin/Coin";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export default function ProjectDetails() {
  const [amount, setAmount] = useState("0.0");

  const accumulatedPoints = useRef(0);
  const currentBatteryWithRef = useRef(0);

  const [isTapping, setIsTapping] = useState(false);
  const [displayedPoints, setDisplayedPoints] = useState(0);
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
        const newVoices = data.filter(voice => !queueArray.some(queueVoice => queueVoice.id === voice.id));
        return new Set([...queueArray, ...newVoices]);
      });
    }
  }, []);

  const playNextVoice = useCallback(() => {
    console.log("playNextVoice called, isPlaying:", isPlaying);
    if (!isPlaying) {
      console.log("Not playing, returning");
      return;
    }

    const unplayedVoices = Array.from(voiceQueue).filter(voice => !voice.is_played);
    console.log("Unplayed voices:", unplayedVoices.length);

    if (unplayedVoices.length > 0) {
      const nextVoice = unplayedVoices[0];
      console.log("Attempting to play voice:", nextVoice);
      const audio = new Audio(nextVoice.audio_url);
      audio.onended = () => {
        console.log("Audio ended, marking as played");
        setVoiceQueue(prevQueue => 
          new Set(Array.from(prevQueue).map(voice => 
            voice === nextVoice ? { ...voice, is_played: true } : voice
          ))
        );
        playNextVoice();
      };
      audio.play().then(() => {
        console.log("Audio started playing successfully");
      }).catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    } else {
      console.log("No more voices in the queue");
      setIsPlaying(false);
    }
  }, [voiceQueue, setVoiceQueue, isPlaying]);

  useEffect(() => {
    console.log("useEffect triggered, isPlaying:", isPlaying);
    if (isPlaying) {
      playNextVoice();
    }
  }, [isPlaying, playNextVoice]);

  useEffect(() => {
    fetchUnplayedVoices();

    const subscription = supabase
      .channel('voice_logs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'voice_logs' }, (payload) => {
        console.log('New voice log inserted:', payload);
        if (payload.new && payload.new.is_played === false) {
          setVoiceQueue(prevQueue => new Set([...prevQueue, payload.new]));
          if (!isPlayingRef.current) {
            startPlayingVoices();
          }
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

  const startPlayingVoices = () => {
    setIsPlaying(true);
    isPlayingRef.current = true;
    playNextVoice();
  };

  const handleClick = useCallback(() => {
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

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      console.log("Recording stopped");
    }
  }, [isRecording]);

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
        const audio = new Audio(url);
        audio.oncanplaythrough = () => {
          console.log("Audio is ready to play");
          audio.play().catch((e) => console.error("Error playing audio:", e));
        };
        audio.onerror = (e) => console.error("Error loading audio:", e);
      };
    }
  }, [mediaRecorderRef.current]);

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

  useEffect(() => {
    const unsubscribe = listenToVoiceUpdates((updatedVoice) => {
      setVoiceQueue(prevQueue => {
        const updatedQueue = new Set([...prevQueue]);
        for (const voice of updatedQueue) {
          if (voice.id === updatedVoice.id) {
            if (updatedVoice.is_played) {
              updatedQueue.delete(voice);
            } else {
              updatedQueue.delete(voice);
              updatedQueue.add(updatedVoice);
            }
            break;
          }
        }
        return updatedQueue;
      });
    });

    return () => unsubscribe();
  }, []);

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
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-full ${
                isRecording
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } hover:bg-opacity-80 transition-colors`}
            >
              {isRecording ? <Square size={24} /> : <Mic size={24} />}
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            {audioUrl && (
              <>
                <button onClick={playAudio}>
                  <Play size={24} /> Play Audio
                </button>
                <button onClick={uploadToSupabase}>
                  <Upload size={24} /> Upload to Supabase
                </button>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="trade"
          className="overflow-y-auto overflow-x-hidden flex-grow"
        >
          <div className="p-4">
            <div className="bg-lime-400 text-black p-2 rounded-lg mb-4 flex items-center text-sm sm:text-base">
              <span className="bg-gray-200 p-1 rounded mr-2">👤</span>
              F6GpDg bought 0.0250 SOL of JOJOY
              <span className="ml-auto">🐶</span>
            </div>

            <div className="mb-4">
              <h2 className="text-green-400 text-base sm:text-lg">
                Market cap: $4,278,531
              </h2>
              <div className="flex items-center bg-gray-800 rounded p-2 mt-2">
                <span className="mr-2">CA:</span>
                <span className="flex-1 truncate text-xs sm:text-sm">
                  J4ze9anpDctWrb5yFjedpTdqznD76FVPgCh
                </span>
                <Button variant="ghost" size="icon">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                  <Button className="bg-green-500 hover:bg-green-600 text-sm sm:text-base">
                    Buy
                  </Button>
                  <Button variant="outline" className="text-sm sm:text-base">
                    Sell
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                  <Button variant="outline" className="text-xs sm:text-sm">
                    switch to Monchhichi
                  </Button>
                  <Button variant="outline" className="text-xs sm:text-sm">
                    Set max slippage
                  </Button>
                </div>
                <div className="relative mb-4">
                  <Input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-16 text-sm sm:text-base"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm sm:text-base">
                    SOL <ChevronDown className="ml-1 h-4 w-4" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount("0.0")}
                    className="text-xs sm:text-sm"
                  >
                    reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount("0.1")}
                    className="text-xs sm:text-sm"
                  >
                    0.1 SOL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount("0.5")}
                    className="text-xs sm:text-sm"
                  >
                    0.5 SOL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount("1")}
                    className="text-xs sm:text-sm"
                  >
                    1 SOL
                  </Button>
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-sm sm:text-base">
                  place trade
                </Button>
                <Button
                  variant="link"
                  className="w-full mt-2 text-sm sm:text-base"
                >
                  add comment
                </Button>
              </CardContent>
            </Card>

            <div className="mt-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Thread
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-800 p-3 sm:p-4 rounded">
                  <div className="flex items-center mb-2">
                    <span className="bg-green-500 text-black px-2 py-1 rounded mr-2 text-xs sm:text-sm">
                      3se2pQ (dev)
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      10/4/2024, 10:28:37 PM
                    </span>
                  </div>
                  <p className="text-sm sm:text-base">
                    Monchhichi (ticker: Monchhichi) Monchhichi (モンチッチ,
                    Monchitchi) is a line of Japanese stuffed monkey toys from
                    the Sekiguchi Corporation, first released in 1974. They were
                    licensed by Mattel in the United States until 1985, and
                    later distributed worldwide directly by Sekiguchi.
                  </p>
                </div>
              </div>
            </div>
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
            <Button onClick={startPlayingVoices} className="bg-blue-500 hover:bg-blue-600">
              Start Voice Playback ({voiceQueue.size})
            </Button>
          </div>
        )}
      </div>
    </Tabs>
  );
}