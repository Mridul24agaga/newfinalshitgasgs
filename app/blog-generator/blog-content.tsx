"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utitls/supabase/client"; // Fixed typo in import path
import { generateBlog } from "@/app/actions";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Calendar, Clock, Trash2, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/app/components/ui/use-toast";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { AppSidebar } from "../components/sidebar";

// Interface for the schedule object from the blog_schedules table
interface Schedule {
  id: string;
  user_id: string;
  website_url: string;
  frequency: "daily" | "weekly" | "monthly";
  day_of_week?: number | null;
  day_of_month?: number | null;
  time_of_day: string;
  is_active: boolean;
  created_at: string;
  last_run?: string | null;
  next_run: string;
}

// Interface for the generateBlog return type
interface GenerateBlogResult {
  headline?: string;
  content?: string;
  initialContent?: string;
  researchSummary?: string;
  imageUrls?: string[];
  is_blurred?: boolean;
  jobId?: string;
  error?: string;
}

export default function IntegratedScheduler() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("daily");
  const [dayOfWeek, setDayOfWeek] = useState<number>(1); // Monday
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [timeOfDay, setTimeOfDay] = useState("09:00");
  const [isCreating, setIsCreating] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);

  // Fetch user's schedules and website URL on component mount
  useEffect(() => {
    fetchSchedules();
    fetchUserWebsite();
    fetchUserCredits();
  }, []);

  // Fetch user's website URL
  const fetchUserWebsite = async () => {
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user) {
        // Try to get the website from the database
        const { data, error } = await supabase
          .from("user_websites")
          .select("website_url")
          .eq("user_id", userData.user.id)
          .single();

        if (data && data.website_url) {
          setWebsiteUrl(data.website_url);
        } else if (error) {
          // Fallback to localStorage if database fetch fails
          const savedUrl = localStorage.getItem("websiteUrl");
          if (savedUrl) {
            setWebsiteUrl(savedUrl);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user website:", error);
    }
  };

  // Fetch user's scheduled blog generations
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user) {
        const { data, error } = await supabase
          .from("blog_schedules")
          .select("*")
          .eq("user_id", userData.user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching schedules:", error);
          toast({
            title: "Error",
            description: "Failed to fetch your scheduled blog generations.",
            variant: "destructive",
          });
          return;
        }

        setSchedules(data || []);
      }
    } catch (error) {
      console.error("Error in fetchSchedules:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's available credits
  const fetchUserCredits = async () => {
    try {
      setIsLoadingCredits(true);
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user) {
        // Get user subscription to check credits
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userData.user.id)
          .single();

        if (subscriptionError && subscriptionError.code !== "PGRST116") {
          console.error("Error fetching subscription:", subscriptionError);
          return;
        }

        if (subscriptionData) {
          // Try multiple possible field names for credits
          let credits = 0;
          if (typeof subscriptionData.credits_available !== "undefined") {
            credits = Number(subscriptionData.credits_available);
          } else if (typeof subscriptionData.credits !== "undefined") {
            credits = Number(subscriptionData.credits);
          } else if (typeof subscriptionData.available_credits !== "undefined") {
            credits = Number(subscriptionData.available_credits);
          }

          // Ensure it's a valid number
          credits = isNaN(credits) ? 0 : credits;
          setUserCredits(credits);
        } else {
          setUserCredits(0);
        }
      }
    } catch (error) {
      console.error("Error fetching user credits:", error);
    } finally {
      setIsLoadingCredits(false);
    }
  };

  // Create a new scheduled blog generation
  const createSchedule = async () => {
    try {
      if (!websiteUrl) {
        toast({
          title: "Missing Website URL",
          description: "Please enter a website URL for blog generation.",
          variant: "destructive",
        });
        return;
      }

      setIsCreating(true);
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to schedule blog generations.",
          variant: "destructive",
        });
        return;
      }

      // Calculate the next run time
      const nextRun = calculateNextRunTime(frequency, dayOfWeek, dayOfMonth, timeOfDay);

      // Create the schedule
      const { error } = await supabase.from("blog_schedules").insert({
        user_id: userData.user.id,
        website_url: websiteUrl,
        frequency,
        day_of_week: frequency === "weekly" ? dayOfWeek : null,
        day_of_month: frequency === "monthly" ? dayOfMonth : null,
        time_of_day: timeOfDay,
        is_active: true,
        created_at: new Date().toISOString(),
        next_run: nextRun.toISOString(),
      });

      if (error) {
        console.error("Error creating schedule:", error);
        toast({
          title: "Error",
          description: "Failed to create scheduled blog generation.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Schedule Created",
        description: "Your scheduled blog generation has been created successfully.",
      });

      // Refresh the schedules
      fetchSchedules();
    } catch (error) {
      console.error("Error in createSchedule:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle a schedule's active status
  const toggleScheduleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("blog_schedules").update({ is_active: !currentStatus }).eq("id", id);

      if (error) {
        console.error("Error toggling schedule status:", error);
        toast({
          title: "Error",
          description: "Failed to update schedule status.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setSchedules(
        schedules.map((schedule) => (schedule.id === id ? { ...schedule, is_active: !currentStatus } : schedule)),
      );

      toast({
        title: "Status Updated",
        description: `Schedule ${!currentStatus ? "activated" : "paused"} successfully.`,
      });
    } catch (error) {
      console.error("Error in toggleScheduleStatus:", error);
    }
  };

  // Delete a schedule
  const deleteSchedule = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("blog_schedules").delete().eq("id", id);

      if (error) {
        console.error("Error deleting schedule:", error);
        toast({
          title: "Error",
          description: "Failed to delete schedule.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
      toast({
        title: "Schedule Deleted",
        description: "Your scheduled blog generation has been deleted.",
      });
    } catch (error) {
      console.error("Error in deleteSchedule:", error);
    }
  };

  // Run a scheduled blog generation manually
  const runScheduleManually = async (schedule: Schedule) => {
    try {
      if (userCredits < 1) {
        toast({
          title: "Insufficient Credits",
          description: "You don't have enough credits to generate a blog.",
          variant: "destructive",
        });
        return;
      }

      // Call the same generateBlog function used in the BlogGenerator component
      const result: GenerateBlogResult = await generateBlog(schedule.website_url);

      if (result.error) {
        toast({
          title: "Error",
          description: `Failed to generate blog: ${result.error}`,
          variant: "destructive",
        });
        return;
      }

      // Update the schedule with last run time and calculate next run
      const now = new Date();
      const lastRun = now.toISOString();
      const nextRun = calculateNextRunTime(
        schedule.frequency,
        schedule.day_of_week || 1,
        schedule.day_of_month || 1,
        schedule.time_of_day,
      );

      const supabase = createClient();
      await supabase
        .from("blog_schedules")
        .update({
          last_run: lastRun,
          next_run: nextRun.toISOString(),
        })
        .eq("id", schedule.id);

      // Refresh data
      fetchSchedules();
      fetchUserCredits();

      toast({
        title: "Blog Generation Started",
        description: "Your blog is being generated. You can view it in your content library once it's complete.",
      });
    } catch (error) {
      console.error("Error running schedule manually:", error);
      toast({
        title: "Error",
        description: "Failed to generate blog. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate the next run time based on frequency and time settings
  const calculateNextRunTime = (
    frequency: "daily" | "weekly" | "monthly",
    dayOfWeek: number,
    dayOfMonth: number,
    timeOfDay: string,
  ): Date => {
    const now = new Date();
    const [hours, minutes] = timeOfDay.split(":").map(Number);

    const nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);

    // If the time is in the past today, move to tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    if (frequency === "weekly") {
      // Set to the next occurrence of the specified day of week (0 = Sunday, 6 = Saturday)
      const currentDay = nextRun.getDay();
      const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;

      if (daysUntilTarget > 0 || (daysUntilTarget === 0 && nextRun <= now)) {
        nextRun.setDate(nextRun.getDate() + daysUntilTarget);
      }
    } else if (frequency === "monthly") {
      // Set to the specified day of the month
      nextRun.setDate(dayOfMonth);

      // If that day has already passed this month, move to next month
      if (nextRun <= now) {
        nextRun.setMonth(nextRun.getMonth() + 1);
      }

      // Handle months with fewer days
      const daysInMonth = new Date(nextRun.getFullYear(), nextRun.getMonth() + 1, 0).getDate();
      if (dayOfMonth > daysInMonth) {
        nextRun.setDate(daysInMonth);
      }
    }

    return nextRun;
  };

  // Format date for display
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not scheduled";

    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-white">
      <AppSidebar />
      <div className="flex-1 w-full overflow-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Font import */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
        `}</style>

        {/* Header */}
        <header className="h-16 border-b border-gray-200 flex items-center px-4 sm:px-6 bg-white sticky top-0 z-10 w-full">
          <h1 className="text-xl font-semibold text-gray-800">Blog Scheduler</h1>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-2 sm:px-3 py-1.5 rounded">
              {isLoadingCredits ? (
                <span className="text-xs sm:text-sm font-medium text-blue-600 flex items-center">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Loading...
                </span>
              ) : (
                <span className="text-xs sm:text-sm font-medium text-blue-600">
                  {userCredits} Credit{userCredits !== 1 ? "s" : ""} Available
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 w-full max-w-7xl mx-auto">
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Schedule automatic blog generation at your preferred frequency. Each scheduled generation will use 1
              credit from your account.
            </AlertDescription>
          </Alert>

          {/* Create Schedule Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Schedule</CardTitle>
              <CardDescription>Set up automatic blog generation on a recurring schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website-url%EC2">Website URL</Label>
                  <Input
                    id="website-url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">URL set during onboarding</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={frequency}
                    onValueChange={(value: "daily" | "weekly" | "monthly") => setFrequency(value)}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {frequency === "weekly" && (
                  <div className="space-y-2">
                    <Label htmlFor="day-of-week">Day of Week</Label>
                    <Select
                      value={dayOfWeek.toString()}
                      onValueChange={(value) => setDayOfWeek(Number.parseInt(value))}
                    >
                      <SelectTrigger id="day-of-week">
                        <SelectValue placeholder="Select day of week" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sunday</SelectItem>
                        <SelectItem value="1">Monday</SelectItem>
                        <SelectItem value="2">Tuesday</SelectItem>
                        <SelectItem value="3">Wednesday</SelectItem>
                        <SelectItem value="4">Thursday</SelectItem>
                        <SelectItem value="5">Friday</SelectItem>
                        <SelectItem value="6">Saturday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {frequency === "monthly" && (
                  <div className="space-y-2">
                    <Label htmlFor="day-of-month">Day of Month</Label>
                    <Select
                      value={dayOfMonth.toString()}
                      onValueChange={(value) => setDayOfMonth(Number.parseInt(value))}
                    >
                      <SelectTrigger id="day-of-month">
                        <SelectValue placeholder="Select day of month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="time-of-day">Time of Day</Label>
                  <Input
                    id="time-of-day"
                    type="time"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                  />
                </div>
              </div>

              {userCredits === 0 && (
                <Alert className="mt-4 bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-700">
                    You need at least 1 credit to schedule blog generation. Please purchase credits to continue.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-500 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Next run:{" "}
                  {formatDate(calculateNextRunTime(frequency, dayOfWeek, dayOfMonth, timeOfDay).toISOString())}
                </div>
                <Button
                  onClick={createSchedule}
                  disabled={isCreating || userCredits === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Schedule"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Schedules */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Your Scheduled Generations</h2>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading your schedules...</span>
              </div>
            ) : schedules.length > 0 ? (
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <Card
                    key={schedule.id}
                    className={`border-l-4 ${schedule.is_active ? "border-l-green-500" : "border-l-gray-300"}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">{schedule.website_url}</h3>

                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {schedule.frequency === "daily" && "Daily"}
                                {schedule.frequency === "weekly" &&
                                  `Weekly on ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][schedule.day_of_week || 0]}`}
                                {schedule.frequency === "monthly" && `Monthly on day ${schedule.day_of_month}`}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date(`2000-01-01T${schedule.time_of_day}`).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            {schedule.last_run && <div>Last run: {formatDate(schedule.last_run)}</div>}
                            {schedule.next_run && schedule.is_active && (
                              <div>Next run: {formatDate(schedule.next_run)}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => runScheduleManually(schedule)}
                            disabled={userCredits < 1}
                            className="text-blue-600 border-blue-200"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Run Now
                          </Button>

                          <div className="flex items-center gap-2">
                            <Switch
                              checked={schedule.is_active}
                              onCheckedChange={() => toggleScheduleStatus(schedule.id, schedule.is_active)}
                              disabled={!schedule.is_active && userCredits === 0}
                            />
                            <span className="text-sm">{schedule.is_active ? "Active" : "Paused"}</span>
                          </div>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => deleteSchedule(schedule.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Schedules Yet</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't created any scheduled blog generations yet. Create your first schedule above.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}