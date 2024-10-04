"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

export function CryptoList() {
  return (
    <div className="space-y-4 py-4">
      {cryptoEntries.map((entry) => (
        <div key={entry.id} className="flex space-x-4 py-4 rounded-lg">
          <Avatar className="w-20 h-20">
            <AvatarImage src={entry.image} alt={entry.name} />
            <AvatarFallback>{entry.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span>Created by</span>
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={entry.creatorAvatar}
                  alt={entry.creatorName}
                />
                <AvatarFallback>{entry.creatorName[0]}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{entry.creatorName}</span>
            </div>
            <div className="text-sm text-gray-600">{entry.timeAgo}</div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600">
                market cap: {entry.marketCap}
              </span>
              {entry.badge && <Badge variant="secondary">{entry.badge}</Badge>}
            </div>
            <div className="text-sm text-gray-600">
              replies: {entry.replies}
            </div>
            <div className="font-semibold">
              {entry.name} (ticker: {entry.ticker}):
            </div>
            <div className="text-sm">{entry.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
