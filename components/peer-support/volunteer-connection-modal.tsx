"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Send, Loader2, User, Star, Award } from "lucide-react";
import { createPeerConnection, type PeerVolunteer } from "@/lib/actions/peer-support";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface VolunteerConnectionModalProps {
  volunteer: PeerVolunteer;
  onConnectionCreated: () => void;
}

export function VolunteerConnectionModal({ volunteer, onConnectionCreated }: VolunteerConnectionModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    topic: "",
    description: "",
    preferred_time: ""
  });

  const supportTopics = [
    "Academic Stress & Study Help",
    "Anxiety & Mental Health",
    "Social & Relationship Issues",
    "Life Transitions & Changes",
    "Time Management & Organization",
    "Career & Future Planning",
    "Family & Home Issues",
    "General Emotional Support"
  ];

  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic || !formData.description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      const scheduledTime = selectedDate && formData.preferred_time 
        ? `${format(selectedDate, 'yyyy-MM-dd')} ${formData.preferred_time}`
        : undefined;

      const result = await createPeerConnection({
        volunteer_id: volunteer.id,
        topic: formData.topic,
        description: formData.description.trim(),
        scheduled_time: scheduledTime
      });

      if (result.error) {
        console.error("Error creating connection:", result.error);
        alert("Failed to create connection request. Please try again.");
      } else {
        // Reset form
        setFormData({
          topic: "",
          description: "",
          preferred_time: ""
        });
        setSelectedDate(undefined);
        setOpen(false);
        onConnectionCreated();
        alert("Connection request sent successfully! The volunteer will be notified and will reach out to you soon.");
      }
    } catch (error) {
      console.error("Error creating connection:", error);
      alert("Failed to create connection request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full"
          >
            Connect
          </Button>
        </motion.div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Connect with {volunteer.display_name}
          </DialogTitle>
        </DialogHeader>
        
        {/* Volunteer Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-2 border-blue-300">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{volunteer.display_name}</h3>
              <p className="text-sm text-blue-600 font-medium">{volunteer.role}</p>
              <p className="text-sm text-gray-600">{volunteer.specialization}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{volunteer.rating.toFixed(1)} rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{volunteer.sessions_helped} helped</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Support Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
              What would you like support with? *
            </Label>
            <Select
              value={formData.topic}
              onValueChange={(value) => handleInputChange("topic", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a support topic" />
              </SelectTrigger>
              <SelectContent>
                {supportTopics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Tell us more about your situation *
            </Label>
            <Textarea
              id="description"
              placeholder="Please provide some context about what you're going through and how this volunteer might be able to help you. This information will help them prepare for your conversation."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-500">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Preferred Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Preferred Date (Optional)
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal border border-gray-300",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Preferred Time */}
          {selectedDate && (
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                Preferred Time
              </Label>
              <Select
                value={formData.preferred_time}
                onValueChange={(value) => handleInputChange("preferred_time", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-900 mb-2">Privacy & Safety:</h4>
            <ul className="text-xs text-yellow-800 space-y-1">
              <li>• All peer support sessions are confidential</li>
              <li>• Volunteers are trained students, not professional counselors</li>
              <li>• For crisis situations, please contact professional help immediately</li>
              <li>• You can end the connection at any time</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.topic || !formData.description.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
