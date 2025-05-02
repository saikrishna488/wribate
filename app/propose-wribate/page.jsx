"use client"
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, ArrowUpCircle, PlayCircle, Plus, SearchX } from "lucide-react";
import { debateAtom, userAtom } from "../states/globalStates";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BsThreeDots } from "react-icons/bs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function DiscoverHotTopicsPage() {
  // Demo debate topics
  const [debates, setDebates] = useState([])
  //   {
  //     id: 1,
  //     title: 'Is Messi better than Ronaldo?',
  //     votes: 87,
  //     category: 'Sports',
  //     tag: 'Football',
  //     country: 'Argentina',
  //     username: 'alex_football'
  //   },
  //   {
  //     id: 2,
  //     title: 'Should higher education be free?',
  //     votes: 64,
  //     category: 'Education',
  //     tag: 'University',
  //     country: 'United States',
  //     username: 'edu_reform'
  //   },
  //   {
  //     id: 3,
  //     title: 'Should higher education be free?',
  //     votes: 64,
  //     category: 'Education',
  //     tag: 'University',
  //     country: 'United States',
  //     username: 'edu_reform'
  //   }
  // ];
  const [user] = useAtom(userAtom);
  const [invoke, setInvoke] = useState(false);

  // Categories for the navigation menu
  const categories = ["All", "Politics", "Education", "Sports", "Technology", "Country"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Category list for the propose form (without "All")
  const categoryOptions = ["Politics", "Education", "Sports", "Technology", "Health", "Entertainment"];

  // Country options for the propose form
  const countryOptions = ["United States", "Canada", "United Kingdom", "Australia", "India", "Brazil", "Argentina", "Japan", "Germany", "France"];

  // Filter debates based on selected category
  const filteredDebates = selectedCategory === "All"
    ? debates
    : debates.filter((debate) => debate.category === selectedCategory);

  // Form state for propose dialog
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tag: "",
    country: "",
    username: user?.userName,
    user_id: user?._id
  });

  useEffect(()=>{
    console.log(user)
  },[user])

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchWrites = async () => {
      try {
        const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/propose', {
          withCredentials: true
        })

        const data = res.data;

        if (data.res) {
          setDebates(data.propose)
        }
      }
      catch (err) {
        console.log(err)
      }
    }


    fetchWrites();
  }, [invoke])

  const handleSubmit = async () => {

    try {

      if (!user?._id) {
        toast.error("login to continue")
        return;
      }

      if (formData.title.length > 100) {
        toast("You have exceeded lenth of 100 chars");
      }

      const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/propose', formData, {
        withCredentials: true
      })

      const data = res.data;

      if (data.res) {
        toast.success("Added!")
        setDebates((prev) => ([data.propose, ...prev]))
      }
    }
    catch (err) {
      console.log(err);
      toast.error("Failed to Add!")
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <header className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-2 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold mb-1">Discover Hot Topics</h1>
          <p className="text-sm text-gray-500">Explore trending debates or propose your own</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => !user?._id ? toast.error("Login to continue") : null} size="sm" className="self-start flex bg-blue-900 rounded-none items-center gap-1">
              <Plus size={14} />
              Propose Wribate
            </Button>
          </DialogTrigger>
          {
            user?._id && (
              <DialogContent className="max-w-full sm:max-w-md p-3 sm:p-6">
                <DialogHeader className="pb-2">
                  <DialogTitle>Propose a New Wribate</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                  <div className="grid gap-1">
                    <Label htmlFor="title" className="text-sm">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter your debate topic"
                      value={formData.title}
                      onChange={(e) => handleFormChange("title", e.target.value)}
                      className="h-8"
                    />
                  </div>

                  <div className="grid gap-1">
                    <Label htmlFor="category" className="text-sm">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleFormChange("category", value)}
                    >
                      <SelectTrigger id="category" className="h-8">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-1">
                    <Label htmlFor="tag" className="text-sm">Tag</Label>
                    <Input
                      id="tag"
                      placeholder="Enter a tag"
                      value={formData.tag}
                      onChange={(e) => handleFormChange("tag", e.target.value)}
                      className="h-8"
                    />
                  </div>

                  <div className="grid gap-1">
                    <Label htmlFor="country" className="text-sm">Country</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleFormChange("country", value)}
                    >
                      <SelectTrigger id="country" className="h-8">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryOptions.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" className="rounded-none" size="sm">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleSubmit} className="bg-blue-800 rounded-none" size="sm">Submit</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            )
          }

        </Dialog>
      </header>

      {/* Navigation Menu */}
      <Tabs
        defaultValue="All"
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="mb-3"
      >
        <nav className="flex flex-row overflow-x-auto items-center gap-2">
          {
            categories.map((cat, idx) => (
              <button onClick={() => setSelectedCategory(cat)} className={`bg-transparent shadow-none ${selectedCategory == cat ? 'border-b border-red-500' : ''} text-xs px-2 text-black hover:text-red-600 rounded-none`} key={idx}>
                {cat}
              </button>
            ))
          }

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="focus:outline-none border-none shadow-none focus:ring-0 focus-visible:ring-0"
              >
                <BsThreeDots className="hover:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="md:w-[400px] w-[300px] rounded-none border">


              <div className="flex flex-row flex-wrap">
                {
                  categories.map((cat, idx) => (
                    <Button onClick={() => setSelectedCategory(cat)} variant={'outline'} className="bg-transparent text-xs text-black border-none shadow-none hover:text-red-600 rounded-none" key={idx}>
                      {cat}
                    </Button>
                  ))
                }
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Content for each tab */}
        <TabsContent value={selectedCategory} className="mt-2">
          {filteredDebates.length > 0 ? (
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDebates.map((debate) => (
                <DebateCard key={debate._id} user={user} invoke={invoke} setInvoke={setInvoke} debate={debate} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <SearchX size={40} className="text-gray-300 mb-2" />
              <p className="text-gray-500">No topics are available to show</p>
              <p className="text-sm text-gray-400 mt-1">Try selecting a different category or propose a new topic</p>
            </div>
          )}
        </TabsContent>
      </Tabs>


    </div>
  );
}

function DebateCard({ debate, user, setInvoke, invoke }) {
  const [votes, setVotes] = useState(debate.votes);
  const [propDebate, setPropDebate] = useAtom(debateAtom);
  const router = useRouter()


  // handle votes
  const handleUpvote = async () => {
    try {

      if (!user?._id) {
        toast.error("Login to vote");
        return;
      }

      const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/propose-vote', {
        id: user?._id,
        propose_id: debate._id
      })

      const data = res.data;

      if (data.res) {
        toast.success("voted")
        setInvoke(!invoke)
        setVotes((prev) => prev + 1);
      }
      else {
        toast.success("Already voted!")
      }
    }
    catch (err) {
      console.log(err);
      toast.error("CLient error")
    }

  };


  const handleLaunch = async () => {
    setPropDebate(debate)
    router.push('/create-wribate')
  }

  return (
    <div className="border rounded bg-white hover:shadow-sm transition-shadow">
      <div className="flex flex-col">
        {/* Title Row */}
        <div className="p-2 border-b">
          <h3 className="font-medium text-sm">{debate.title}</h3>
        </div>

        {/* Info Row */}
        <div className="flex justify-between items-center p-2 text-xs">
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs py-0 px-1 h-5">{debate.category}</Badge>
            <Badge variant="outline" className="text-xs py-0 px-1 h-5">{debate.tag}</Badge>
          </div>

          <div className="text-gray-500">
            <span>{debate.country}</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex justify-between items-center bg-gray-50 px-2 py-1">
          <div className="flex items-center text-gray-500 text-xs">
            <User size={12} className="mr-1" />
            <span>{debate.username}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleUpvote}
              className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900 bg-white rounded px-2 py-1 border"
            >
              <ArrowUpCircle size={12} />
              <span>{votes}</span>
            </button>
            <button onClick={handleLaunch} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 rounded px-2 py-1 border border-blue-200">
              <PlayCircle size={12} />
              <span>Launch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}