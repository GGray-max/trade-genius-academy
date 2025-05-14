
import { useState } from "react";
import { createElement } from "react";
import { Search, FileText, Book, Code, Terminal, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";

const Docs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "getting-started", label: "Getting Started", icon: FileText },
    { id: "guides", label: "User Guides", icon: Book },
    { id: "api", label: "API Reference", icon: Code },
    { id: "examples", label: "Examples", icon: Terminal },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  const docs = [
    {
      id: "1",
      title: "Introduction to TradeWizard",
      category: "getting-started",
      description: "Learn about the core concepts and features of TradeWizard platform.",
      timeToRead: "5 min read",
    },
    {
      id: "2",
      title: "Setting Up Your First Bot",
      category: "getting-started",
      description: "Step-by-step guide to creating and deploying your first trading bot.",
      timeToRead: "10 min read",
    },
    {
      id: "3",
      title: "Advanced Trading Strategies",
      category: "guides",
      description: "Explore advanced trading strategies and how to implement them with TradeWizard.",
      timeToRead: "15 min read",
    },
    {
      id: "4",
      title: "Bot API Documentation",
      category: "api",
      description: "Complete reference for the Bot API with examples and parameters.",
      timeToRead: "20 min read",
    },
    {
      id: "5",
      title: "Authentication and Security",
      category: "api",
      description: "Learn how to secure your bots and API connections.",
      timeToRead: "8 min read",
    },
    {
      id: "6",
      title: "Market Data Integration",
      category: "guides",
      description: "How to connect and use real-time market data in your bots.",
      timeToRead: "12 min read",
    },
    {
      id: "7",
      title: "Crypto Bot Example",
      category: "examples",
      description: "Complete example of a cryptocurrency trading bot with explained code.",
      timeToRead: "25 min read",
    },
    {
      id: "8",
      title: "Common Issues & Solutions",
      category: "faq",
      description: "Answers to frequently asked questions and common troubleshooting tips.",
      timeToRead: "10 min read",
    }
  ];

  const filteredDocs = searchQuery 
    ? docs.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : docs;

  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            TradeWizard Documentation
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Everything you need to know about using TradeWizard trading bots
          </p>
        </div>

        <div className="mt-10 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search documentation..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="all">
            <div className="flex justify-center">
              <TabsList className="mb-8">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
                  >
                    {categories.find(c => c.id === doc.category)?.icon && (
                      <div className="p-2 bg-tw-blue-light bg-opacity-20 rounded-md w-fit mb-4">
                        {createElement(categories.find(c => c.id === doc.category)?.icon as any, {
                          className: "h-5 w-5 text-tw-blue"
                        })}
                      </div>
                    )}
                    <h3 className="text-lg font-semibold">{doc.title}</h3>
                    <p className="mt-2 text-gray-600">{doc.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">{doc.timeToRead}</span>
                      <Button variant="link" className="text-tw-blue">
                        Read More →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredDocs
                    .filter((doc) => doc.category === category.id)
                    .map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
                      >
                        {createElement(category.icon, {
                          className: "h-5 w-5 text-tw-blue mb-4"
                        })}
                        <h3 className="text-lg font-semibold">{doc.title}</h3>
                        <p className="mt-2 text-gray-600">{doc.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm text-gray-500">{doc.timeToRead}</span>
                          <Button variant="link" className="text-tw-blue">
                            Read More →
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="mt-20 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold">Need more help?</h2>
          <p className="mt-2 text-gray-600">
            Can't find what you're looking for in our documentation? Our support team is here to help.
          </p>
          <div className="mt-6">
            <Button className="bg-tw-blue hover:bg-tw-blue-dark">Contact Support</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Docs;
