import Link from "next/link";
import truncateEthAddress from "truncate-eth-address";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/server-client";

interface CryptoEntry {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  timeAgo: string;
  marketCap: string;
  badge?: string;
  replies: number;
  name: string;
  ticker: string;
  description: string;
  image: string;
}

const cryptoEntries: CryptoEntry[] = [
  {
    id: "1",
    creatorName: "BzB2sN",
    creatorAvatar: "/placeholder.svg?height=40&width=40",
    timeAgo: "2h ago",
    marketCap: "19.30K",
    badge: "👑",
    replies: 192,
    name: "Tomi",
    ticker: "TOMI",
    description: "To Million $TOMI",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "2",
    creatorName: "57kPNY",
    creatorAvatar: "/placeholder.svg?height=40&width=40",
    timeAgo: "34m ago",
    marketCap: "38.51K",
    badge: "👑",
    replies: 20,
    name: "Je Won the Monk Cat",
    ticker: "JEWON",
    description:
      "Je Won is the authentic Monk Cat, a devoted meditator, committed vegan, and resident of the Kaeng Khan Sung Monastery, nestled in the serene northeast of Thailand near the Laos border. He's about to transcend his divine powers firstly within the world of crypto, then his local community, the country and then the wider world.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "3",
    creatorName: "HWNYER",
    creatorAvatar: "/placeholder.svg?height=40&width=40",
    timeAgo: "18m ago",
    marketCap: "5.78K",
    replies: 9,
    name: "BaoBao",
    ticker: "BAO",
    description: "Bao Bao 宝宝",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "4",
    creatorName: "DszxLt",
    creatorAvatar: "/placeholder.svg?height=40&width=40",
    timeAgo: "22m ago",
    marketCap: "14.52K",
    replies: 14,
    name: "Samu",
    ticker: "Samu",
    description: "",
    image: "/placeholder.svg?height=80&width=80",
  },
];

export default async function Home() {
  const supabase = createClient();
  // const { data: projectListData } = await supabase.from("projects").select();
  const { data: projectListData, error: fetchingProjectListDataError } =
    await supabase.from("projects").select();

  console.log("projectListData", projectListData, fetchingProjectListDataError);

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
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5WA2PMXgXzQ2AS15kKDz9svzLx4BpvviP6w&s"
            alt="Jolik"
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
            <div className="font-bold">Joker Vitalik [ticker: JOLIK]:</div>
            <div className="text-sm">
              JolikCoin: Vitalik meets Joker in this chaotic Ethereum meme
              token. With 4.20 billion coins and features like the &quot;Arkham
              Asylum Vault,&quot; it aims to disrupt crypto while making you
              smile. Why so serious about finance?
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
        {cryptoEntries.map((entry) => (
          <Link key={entry.id} href={`/${entry.id}`}>
            <div className="flex items-center space-x-2 text-foreground border border-foreground p-2">
              <Avatar className="w-36 h-36">
                <AvatarImage src={entry.image} alt={entry.name} />
                <AvatarFallback>{entry.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-foreground">Created by</span>
                  <span className="text-xs text-blue-700">
                    {truncateEthAddress(
                      "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">
                    market cap: {entry.marketCap}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">
                    taps: {entry.marketCap}
                  </span>
                </div>
                <div className="font-bold">
                  {entry.name} [ticker: {entry.ticker}]:
                </div>
                <div className="text-sm">{entry.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
