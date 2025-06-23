import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  selectedTime: number;
  onTimeChange: (time: number) => void;
  disabled: boolean;
}

const timeOptions = [
  { value: 60, label: "1 minute" },
  { value: 180, label: "3 minutes" },
  { value: 300, label: "5 minutes" },
  { value: 600, label: "10 minutes" },
  { value: 900, label: "15 minutes" },
  { value: 1800, label: "30 minutes" },
  { value: 3600, label: "1 hour" },
];

const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedTime,
  onTimeChange,
  disabled,
}) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Clock className="h-5 w-5 text-slate-300" />
      <Select
        value={selectedTime.toString()}
        onValueChange={(value) => onTimeChange(parseInt(value))}
        disabled={disabled}
      >
        <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
          <SelectValue placeholder="Select game time" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          {timeOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value.toString()}
              className="text-white hover:bg-slate-600 focus:bg-slate-600"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelector;
