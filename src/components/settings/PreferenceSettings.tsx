
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Sun, Moon, Globe, Bell } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const preferencesFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.string(),
  emailNotifications: z.boolean(),
  botUpdates: z.boolean(),
  marketAlerts: z.boolean(),
  requestUpdates: z.boolean(),
});

const PreferenceSettings = () => {
  const { profile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // Load preferences from localStorage or set defaults
  const loadPreferences = () => {
    if (typeof window === "undefined") return {
      theme: "system",
      language: "en",
      emailNotifications: true,
      botUpdates: true,
      marketAlerts: true,
      requestUpdates: true,
    };
    
    const savedPrefs = localStorage.getItem("user-preferences");
    if (savedPrefs) {
      try {
        return JSON.parse(savedPrefs);
      } catch (e) {
        console.error("Error parsing saved preferences", e);
      }
    }
    
    return {
      theme: "system",
      language: "en",
      emailNotifications: true,
      botUpdates: true,
      marketAlerts: true,
      requestUpdates: true,
    };
  };

  const form = useForm<z.infer<typeof preferencesFormSchema>>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: loadPreferences(),
  });

  // Apply theme on load and when it changes
  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === "dark" || 
       (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };
  
  useEffect(() => {
    const theme = form.watch("theme");
    applyTheme(theme);
    
    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => applyTheme("system");
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
  }, [form.watch("theme")]);

  const onSubmit = async (data: z.infer<typeof preferencesFormSchema>) => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem("user-preferences", JSON.stringify(data));
      
      // If we had a backend API for preferences, we'd save there too
      // For now we'll just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("Preferences saved successfully!");
    } catch (error: any) {
      toast.error(`Failed to save preferences: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the appearance of the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Theme</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={(value) => {
                        if (value) field.onChange(value);
                      }}
                      className="flex justify-start"
                    >
                      <ToggleGroupItem value="light" aria-label="Light mode">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </ToggleGroupItem>
                      <ToggleGroupItem value="dark" aria-label="Dark mode">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </ToggleGroupItem>
                      <ToggleGroupItem value="system" aria-label="System theme">
                        <Globe className="h-4 w-4 mr-2" />
                        System
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormDescription>
                    Select your preferred theme for the application
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose your preferred language for the application interface
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email Notifications</FormLabel>
                    <FormDescription>
                      Receive notifications via email
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="botUpdates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Bot Updates</FormLabel>
                    <FormDescription>
                      Receive notifications about bot updates and changes
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!form.watch("emailNotifications")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketAlerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Market Alerts</FormLabel>
                    <FormDescription>
                      Receive important market alerts and opportunities
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!form.watch("emailNotifications")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestUpdates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Bot Request Status Updates</FormLabel>
                    <FormDescription>
                      Receive updates about your bot requests
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!form.watch("emailNotifications")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save preferences"}
        </Button>
      </form>
    </Form>
  );
};

export default PreferenceSettings;
