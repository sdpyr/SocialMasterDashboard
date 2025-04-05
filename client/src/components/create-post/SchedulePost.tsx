"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface SchedulePostProps {
  isScheduled: boolean;
  setIsScheduled: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleDate: Date | null;
  setScheduleDate: React.Dispatch<React.SetStateAction<Date | null>>;
  scheduleTime: string;
  setScheduleTime: React.Dispatch<React.SetStateAction<string>>;
}

export function SchedulePost({
  isScheduled,
  setIsScheduled,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime
}: SchedulePostProps) {
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-lg font-semibold text-gray-800">Zamanlama</h3>
          <p className="text-sm text-gray-500">
            İçeriğinizi ileri bir tarihte paylaşmak için zamanlayın
          </p>
        </div>
        <Switch 
          checked={isScheduled} 
          onCheckedChange={setIsScheduled}
        />
      </div>

      {isScheduled && (
        <div className="space-y-4 mt-4 pl-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Tarih</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                    id="schedule-date"
                  >
                    <i className="ri-calendar-line mr-2"></i>
                    {scheduleDate ? (
                      format(scheduleDate, "PPP", { locale: tr })
                    ) : (
                      <span>Tarih seçin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduleDate || undefined}
                    onSelect={setScheduleDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule-time">Saat</Label>
              <Select value={scheduleTime} onValueChange={setScheduleTime}>
                <SelectTrigger id="schedule-time" className="w-full">
                  <SelectValue placeholder="Saat seçin" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-xs text-gray-500 italic">
            Not: Zamanlanmış gönderiler, belirlediğiniz zamanda otomatik olarak paylaşılacaktır. Zamanlanmış gönderilerinizi daha sonra düzenleyebilir veya iptal edebilirsiniz.
          </div>
        </div>
      )}
    </div>
  );
}