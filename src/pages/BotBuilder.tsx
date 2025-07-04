import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Bot,
  Plus,
  Trash2,
  Save,
  Download,
  ArrowRight,
  Settings,
  Code,
  LineChart,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// Define block types and their configurations
const blockTypes = {
  indicator: {
    category: "Technical Analysis",
    blocks: [
      { id: "rsi", name: "RSI", description: "Relative Strength Index" },
      { id: "macd", name: "MACD", description: "Moving Average Convergence Divergence" },
      { id: "ma", name: "Moving Average", description: "Simple/Exponential Moving Average" },
      { id: "bb", name: "Bollinger Bands", description: "Volatility Bands" },
    ]
  },
  entry: {
    category: "Entry Rules",
    blocks: [
      { id: "crossover", name: "Indicator Crossover", description: "Enter on indicator crossover" },
      { id: "threshold", name: "Threshold Break", description: "Enter when value breaks threshold" },
      { id: "pattern", name: "Pattern Recognition", description: "Enter on pattern formation" },
    ]
  },
  exit: {
    category: "Exit Rules",
    blocks: [
      { id: "tp", name: "Take Profit", description: "Exit at profit target" },
      { id: "sl", name: "Stop Loss", description: "Exit at loss limit" },
      { id: "trailing", name: "Trailing Stop", description: "Dynamic stop loss" },
    ]
  },
  risk: {
    category: "Risk Management",
    blocks: [
      { id: "position", name: "Position Sizing", description: "Calculate position size" },
      { id: "maxdd", name: "Max Drawdown", description: "Maximum drawdown limit" },
      { id: "correlation", name: "Correlation Filter", description: "Check market correlation" },
    ]
  }
};

const platforms = [
  { id: "mt4", name: "MetaTrader 4", language: "MQL4" },
  { id: "mt5", name: "MetaTrader 5", language: "MQL5" },
  { id: "deriv", name: "Deriv.com", language: "JavaScript" },
];

interface Block {
  id: string;
  type: string;
  config: any;
}

const BotBuilder = () => {
  const [activeTab, setActiveTab] = useState("design");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [botName, setBotName] = useState("");
  const [botDescription, setBotDescription] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // AI strategy assistant
  const [goal, setGoal] = useState("");
  const [aiStrategy, setAiStrategy] = useState<any>(null);
  const [strategyLoading, setStrategyLoading] = useState(false);


  const handleAddBlock = (blockType: string, blockId: string) => {
    setBlocks([...blocks, {
      id: `${blockId}-${Date.now()}`,
      type: blockType,
      config: {}
    }]);
  };

  const handleRemoveBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const handleUpdateBlockConfig = (blockId: string, config: any) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, config } : block
    ));
  };

  const handleGenerateStrategy = async () => {
    if (!goal) {
      toast.error("Please describe your trading goal");
      return;
    }
    try {
      setStrategyLoading(true);
      const res = await api.post("/ai-strategy", { goal });
      setAiStrategy(res.data.strategy);
      // Persist for Backtest page
      localStorage.setItem("latestStrategy", JSON.stringify(res.data.strategy));
      toast.success("Strategy generated! Review below.");
    } catch (error) {
      toast.error("Failed to generate strategy. Please try again.");
    } finally {
      setStrategyLoading(false);
    }
  };

  const handleGenerateBot = async () => {
    if (!botName) {
      toast.error("Please enter a bot name");
      return;
    }

    if (!selectedPlatform) {
      toast.error("Please select a target platform");
      return;
    }

    if (!aiStrategy) {
      toast.error("Please generate a strategy first");
      return;
    }

    setIsGenerating(true);
    try {
      // Here we would generate the actual bot code based on the blocks
      // For now, we'll simulate it with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a simple MQL4/5 or JS code based on the blocks
      // Simple code stub using generated strategy. TODO: replace with full code generation.
      const code = `// ${botName} - AI Strategy Bot\n// Auto-generated code\n// Platform: ${selectedPlatform}\n// Strategy:\n// Entry: ${aiStrategy.entry}\n// Exit: ${aiStrategy.exit}\n// StopLoss: ${aiStrategy.stopLoss}\n// TakeProfit: ${aiStrategy.takeProfit}\n// Risk: ${aiStrategy.riskManagement}\n`;


      // Create a blob and download it
      const blob = new Blob([code], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${botName.toLowerCase().replace(/\\s+/g, '_')}_${selectedPlatform}.${getFileExtension(selectedPlatform)}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Bot generated successfully!");
    } catch (error) {
      toast.error("Failed to generate bot. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getFileExtension = (platform: string) => {
    switch (platform) {
      case 'mt4':
        return 'mq4';
      case 'mt5':
        return 'mq5';
      case 'deriv':
        return 'js';
      default:
        return 'txt';
    }
  };

  const generateCode = (platform: string, blocks: Block[]) => {
    // This is a simplified version - in a real app, we'd have proper code generation
    switch (platform) {
      case 'mt4':
        return generateMQL4Code(blocks);
      case 'mt5':
        return generateMQL5Code(blocks);
      case 'deriv':
        return generateDerivCode(blocks);
      default:
        return '';
    }
  };

  const generateMQL4Code = (blocks: Block[]) => {
    return `//+------------------------------------------------------------------+
//|                                                     ${botName}.mq4 |
//|                                          Copyright © 2024, Your Name |
//+------------------------------------------------------------------+
#property copyright "Copyright © 2024"
#property link      ""
#property version   "1.00"
#property strict

// Input parameters
${blocks.map(block => generateMQL4BlockCode(block)).join('\n\n')}

// Initialize function
int OnInit()
{
   return(INIT_SUCCEEDED);
}

// Deinitialize function
void OnDeinit(const int reason)
{
}

// Main trading function
void OnTick()
{
   // Trading logic based on blocks
   ${blocks.map(block => generateMQL4BlockLogic(block)).join('\n   ')}
}`;
  };

  const generateMQL5Code = (blocks: Block[]) => {
    return `//+------------------------------------------------------------------+
//|                                                     ${botName}.mq5 |
//|                                          Copyright © 2024, Your Name |
//+------------------------------------------------------------------+
#property copyright "Copyright © 2024"
#property link      ""
#property version   "1.00"

// Input parameters
${blocks.map(block => generateMQL5BlockCode(block)).join('\n\n')}

// Initialize function
int OnInit()
{
   return(INIT_SUCCEEDED);
}

// Deinitialize function
void OnDeinit(const int reason)
{
}

// Main trading function
void OnTick()
{
   // Trading logic based on blocks
   ${blocks.map(block => generateMQL5BlockLogic(block)).join('\n   ')}
}`;
  };

  const generateDerivCode = (blocks: Block[]) => {
    return `// ${botName}
// A trading bot for deriv.com

const DerivAPIBasic = require('@deriv/deriv-api/dist/DerivAPIBasic');
const WebSocket = require('ws');

const ws = new WebSocket('wss://ws.binaryws.com/websockets/v3');
const api = new DerivAPIBasic({ connection: ws });

${blocks.map(block => generateDerivBlockCode(block)).join('\n\n')}

// Main trading logic
async function main() {
    // Initialize indicators and variables
    ${blocks.map(block => generateDerivBlockLogic(block)).join('\n    ')}
}

main();`;
  };

  const generateMQL4BlockCode = (block: Block) => {
    switch (block.type) {
      case 'indicator':
        return `input int ${block.id}_period = 14; // Period for ${block.id.toUpperCase()}`;
      case 'entry':
        return `input double ${block.id}_threshold = 0.0; // Threshold for ${block.id}`;
      case 'exit':
        return `input double ${block.id}_level = 0.0; // Level for ${block.id}`;
      case 'risk':
        return `input double ${block.id}_value = 0.0; // Value for ${block.id}`;
      default:
        return '';
    }
  };

  const generateMQL5BlockCode = (block: Block) => {
    // Similar to MQL4 but with MQL5 specific syntax
    return generateMQL4BlockCode(block);
  };

  const generateDerivBlockCode = (block: Block) => {
    switch (block.type) {
      case 'indicator':
        return `// ${block.id.toUpperCase()} Configuration
const ${block.id}Config = {
    period: 14
};`;
      case 'entry':
        return `// Entry rules for ${block.id}
const ${block.id}Rules = {
    threshold: 0.0
};`;
      case 'exit':
        return `// Exit rules for ${block.id}
const ${block.id}Rules = {
    level: 0.0
};`;
      case 'risk':
        return `// Risk management for ${block.id}
const ${block.id}Config = {
    value: 0.0
};`;
      default:
        return '';
    }
  };

  const generateMQL4BlockLogic = (block: Block) => {
    switch (block.type) {
      case 'indicator':
        return `double ${block.id}_value = i${block.id.toUpperCase()}(Symbol(), PERIOD_CURRENT, ${block.id}_period);`;
      case 'entry':
        return `if (${block.id}_condition) { /* Entry logic */ }`;
      case 'exit':
        return `if (${block.id}_condition) { /* Exit logic */ }`;
      case 'risk':
        return `// Risk management logic for ${block.id}`;
      default:
        return '';
    }
  };

  const generateMQL5BlockLogic = (block: Block) => {
    // Similar to MQL4 but with MQL5 specific syntax
    return generateMQL4BlockLogic(block);
  };

  const generateDerivBlockLogic = (block: Block) => {
    switch (block.type) {
      case 'indicator':
        return `const ${block.id}Value = await calculate${block.id.toUpperCase()}();`;
      case 'entry':
        return `if (checkEntryConditions(${block.id}Rules)) { /* Entry logic */ }`;
      case 'exit':
        return `if (checkExitConditions(${block.id}Rules)) { /* Exit logic */ }`;
      case 'risk':
        return `applyRiskManagement(${block.id}Config);`;
      default:
        return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bot Builder</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create your custom trading bot using pre-built blocks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Building Area */}
            {/* AI Strategy Assistant */}
            <Card>
              <CardHeader>
                <CardTitle>AI Strategy Assistant</CardTitle>
                <CardDescription>Describe your trading goal and let AI craft a strategy.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="e.g., low-risk crypto bot focusing on BTC/ETH swing trades"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
                <Button
                  onClick={handleGenerateStrategy}
                  disabled={strategyLoading}
                  className="w-full"
                >
                  {strategyLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating...
                    </>
                  ) : (
                    "Generate Strategy"
                  )}
                </Button>
                {aiStrategy && (
                  <div className="bg-gray-50 p-4 rounded-md text-sm space-y-1">
                    <p><strong>Entry:</strong> {aiStrategy.entry}</p>
                    <p><strong>Exit:</strong> {aiStrategy.exit}</p>
                    <p><strong>Stop Loss:</strong> {aiStrategy.stopLoss}</p>
                    <p><strong>Take Profit:</strong> {aiStrategy.takeProfit}</p>
                    <p><strong>Risk Mgmt:</strong> {aiStrategy.riskManagement}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bot Configuration</CardTitle>
                <CardDescription>Configure your bot's basic settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="botName">Bot Name</Label>
                    <Input
                      id="botName"
                      placeholder="Enter bot name"
                      value={botName}
                      onChange={(e) => setBotName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform">Target Platform</Label>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map(platform => (
                          <SelectItem key={platform.id} value={platform.id}>
                            {platform.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of your bot"
                    value={botDescription}
                    onChange={(e) => setBotDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Building Blocks</CardTitle>
                <CardDescription>Drag and drop blocks to build your bot</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {blocks.map((block, index) => (
                      <Card key={block.id}>
                        <CardHeader className="py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge>{block.type}</Badge>
                              <span className="font-medium">
                                {blockTypes[block.type as keyof typeof blockTypes].blocks.find(b => b.id === block.id.split('-')[0])?.name}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveBlock(block.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {/* Block configuration UI would go here */}
                          <p className="text-sm text-muted-foreground">Configuration options coming soon</p>
                        </CardContent>
                      </Card>
                    ))}

                    {blocks.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">
                          Add blocks from the right panel to build your bot
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Blocks Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Blocks</CardTitle>
                <CardDescription>Click to add blocks to your bot</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="indicator">
                  <TabsList className="grid grid-cols-2 lg:grid-cols-4">
                    <TabsTrigger value="indicator">Indicators</TabsTrigger>
                    <TabsTrigger value="entry">Entry</TabsTrigger>
                    <TabsTrigger value="exit">Exit</TabsTrigger>
                    <TabsTrigger value="risk">Risk</TabsTrigger>
                  </TabsList>
                  {Object.entries(blockTypes).map(([type, category]) => (
                    <TabsContent key={type} value={type} className="mt-4">
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-2">
                          {category.blocks.map(block => (
                            <Card key={block.id} className="cursor-pointer hover:bg-accent"
                              onClick={() => handleAddBlock(type, block.id)}>
                              <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <CardTitle className="text-sm">{block.name}</CardTitle>
                                    <CardDescription>{block.description}</CardDescription>
                                  </div>
                                  <Plus className="h-4 w-4" />
                                </div>
                              </CardHeader>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Show Advanced Options</p>
                    <p className="text-sm text-muted-foreground">
                      Enable additional configuration options
                    </p>
                  </div>
                  <Switch
                    checked={showAdvanced}
                    onCheckedChange={setShowAdvanced}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerateBot}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>Generating Bot...</>
              ) : (
                <>Generate & Download Bot</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BotBuilder; 