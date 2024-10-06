import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/server-client";
import Link from "next/link";
import truncateEthAddress from "truncate-eth-address";

export default async function Home() {
  const supabase = createClient();
  const { data: projectListData } = await supabase.from("projects").select();

  return (
    <div className="min-h-screen text-white p-4 space-y-4">
      <Link href="/create">
        <h1 className="text-3xl font-bold text-center text-foreground">
          [start a new cult]
        </h1>
      </Link>

      <div className="bg-blue-700 p-2 text-center font-bold text-2xl">
        cult of retardio
      </div>

      <div className="bg-amber-600 p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_uJGU94rrGdJz55SgDaEQapkjip47gaKYCQ&s"
            alt="RONELDO"
            className="w-36 h-36 rounded-full"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span>Created by</span>
              <span className="text-xs text-blue-700">
                {truncateEthAddress(
                  "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">market cap: 29.14K</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">taps: 69.420K</span>
            </div>
            <div className="font-bold">RONELDO [ticker: SUIII]:</div>
            <div className="text-sm">
              SUIcoin is a meme cryptocurrency based on Ronaldo&apos;s famous
              &quot;SUI&quot; celebration. It lets fans celebrate trades by
              shouting &quot;SUI!&quot; like their football idol. The coin
              combines internet humor with Ronaldo&apos;s global popularity for
              a unique crypto experience.
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="search for token"
          className="flex-grow bg-green-600 p-2 text-white placeholder-white"
        />
        <button className="bg-green-600 px-4 py-2">search</button>
      </div>

      <div className="space-y-4 py-4">
        {!!projectListData
          ? projectListData.map((item) => (
              <Link key={item.token_address} href={`/${item.token_address}`}>
                <div className="flex items-center space-x-2 text-foreground border border-foreground p-2">
                  <Avatar className="w-36 h-36">
                    <AvatarImage
                      src={item.token_details.image_url}
                      alt={item.name}
                    />
                    <AvatarFallback>
                      {item.token_details.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-foreground">Created by</span>
                      <span className="text-xs text-blue-700">
                        {truncateEthAddress(item.user_address)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">
                        market cap:{" "}
                        {`${(Math.random() * 28000 + 4000).toFixed(0)}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">
                        taps: {item.total_points_allocated}
                      </span>
                    </div>
                    <div className="font-bold">
                      {item.token_details.name} [ticker:{" "}
                      {item.token_details.symbol}]:
                    </div>
                    <div className="text-sm">
                      {!!item.token_details.description
                        ? item.token_details.description
                        : ""}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          : "no project found"}
      </div>
    </div>
  );
}
