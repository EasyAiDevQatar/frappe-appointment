/**
 * External dependencies.
 */
import { useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Clock,
  ChevronLeft,
} from "lucide-react";
import { useFrappeGetCall } from "frappe-react-sdk";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/button";
import { Switch } from "@/components/switch";
import Typography from "@/components/typography";
import {
  cn,
  getTimeZoneOffsetFromTimeZoneString,
} from "@/lib/utils";
import { useAppContext } from "@/context/app";
import TimeSlotSkeleton from "./timeSlotSkeleton";
import TimeZoneSelect from "./timeZoneSelectmenu";
import { CalendarWrapper } from "@/components/calendar-wrapper";
import { getAllSupportedTimeZones } from "@/lib/utils";

export interface DateTimeSelectionData {
  date: Date;
  startTime: string;
  endTime: string;
  timeZone: string;
}

interface DateTimeSelectionProps {
  onNext: (data: DateTimeSelectionData) => void;
  onBack: () => void;
  durationId: string;
  isMobileView: boolean;
  displayMonth: Date;
  setDisplayMonth: (date: Date) => void;
  timeFormat: "12h" | "24h";
  setTimeFormat: (format: "12h" | "24h") => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const DateTimeSelection = ({
  onNext,
  onBack,
  durationId,
  isMobileView,
  displayMonth,
  setDisplayMonth,
  timeFormat,
  setTimeFormat,
  expanded,
  setExpanded,
}: DateTimeSelectionProps) => {
  const {
    timeZone,
    setTimeZone,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
  } = useAppContext();

  const { data, isLoading, error } = useFrappeGetCall(
    "frappe_appointment.api.personal_meet.get_time_slots",
    {
      duration_id: durationId,
      date: new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }).format(selectedDate),
      user_timezone_offset: String(
        getTimeZoneOffsetFromTimeZoneString(timeZone || "Asia/Calcutta")
      ),
    },
    undefined,
    {
      revalidateOnFocus: false,
      errorRetryCount: 3,
    }
  );

  const meetingData = data?.message || {
    all_available_slots_for_data: [],
    valid_start_date: null,
    valid_end_date: null,
    available_days: [],
  };

  const formatTimeSlot = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: timeFormat === "12h",
      timeZone,
    }).format(date);
  };

  const handleSlotSelect = (slot: { start_time: string; end_time: string }) => {
    setSelectedSlot(slot);
    onNext({
      date: selectedDate,
      startTime: slot.start_time,
      endTime: slot.end_time,
      timeZone,
    });
  };

  return (
    <motion.div
      key="date-time-selection"
      className="w-full flex max-lg:flex-col gap-4 md:p-6 pb-5"
      initial={isMobileView ? {} : { x: "100%" }}
      animate={{ x: 0 }}
      exit={isMobileView ? {} : { x: "-100%" }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {(!isMobileView || !expanded) && (
        <div className="flex flex-col w-full lg:w-[25rem] shrink-0">
          <div className="flex gap-3 mb-4 max-md:flex-col md:items-center md:justify-between">
            <Typography variant="p" className="text-2xl">
              Select Date & Time
            </Typography>
            <Typography className="text-sm text-muted-foreground">
              Step 4 of 4
            </Typography>
          </div>

          <CalendarWrapper
            displayMonth={displayMonth}
            selectedDate={selectedDate}
            loading={false}
            setDisplayMonth={setDisplayMonth}
            meetingData={{
              valid_start_date: meetingData.valid_start_date,
              valid_end_date: meetingData.valid_end_date,
              available_days: meetingData.available_days,
            }}
            setSelectedDate={setSelectedDate}
            onDayClick={(date) => {
              setSelectedDate(date);
              setDisplayMonth(date);
              setExpanded(true);
              setSelectedSlot({
                start_time: "",
                end_time: "",
              });
            }}
            className="rounded-xl md:border md:h-96 w-full flex md:px-6 p-0"
          />
          <div className="mt-4 gap-5 flex max-md:flex-col md:justify-between md:items-center">
            {/* Timezone */}
            <TimeZoneSelect
              timeZones={getAllSupportedTimeZones()}
              setTimeZone={setTimeZone}
              timeZone={timeZone}
              disable={false}
            />

            {/* Time Format Toggle */}
            <div className="flex items-center gap-2">
              <Typography className="text-sm text-gray-700 dark:text-slate-300">
                AM/PM
              </Typography>
              <Switch
                className="data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400 active:ring-blue-400 focus-visible:ring-blue-400"
                checked={timeFormat === "24h"}
                onCheckedChange={(checked) => {
                  setTimeFormat(checked ? "24h" : "12h");
                }}
              />
              <Typography className="text-sm text-gray-700 dark:text-slate-300">
                24H
              </Typography>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar (Mobile) */}
      {isMobileView && expanded && (
        <div className="h-14 fixed bottom-0 left-0 w-screen border z-10 bg-background border-top flex items-center justify-between px-4">
          <Button
            variant="link"
            className="text-blue-500 dark:text-blue-400 px-0"
            onClick={() => setExpanded(false)}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      )}

      {/* Available slots */}
      <div
        className={cn(
          "w-48 shrink-0 max-lg:w-full overflow-hidden space-y-4 max-md:pb-10  transition-all duration-300 ",
          !expanded && "max-lg:hidden"
        )}
      >
        <h3 className="text-sm font-semibold lg:w-full">
          {format(selectedDate, "EEEE, d MMMM yyyy")}
        </h3>
        {isLoading ? (
          <TimeSlotSkeleton />
        ) : (
          <div
            className="lg:h-[22rem] overflow-y-auto no-scrollbar space-y-2 transition-transform transform"
            style={{
              transform: selectedDate ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            {meetingData.all_available_slots_for_data.length > 0 ? (
              meetingData.all_available_slots_for_data.map(
                (slot: { start_time: string; end_time: string }, index: number) => (
                  <Button
                    key={index}
                    onClick={() => handleSlotSelect(slot)}
                    variant="outline"
                    className="w-full font-normal border border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-400 ease-in-out duration-200 hover:bg-blue-50 dark:hover:bg-blue-800/20 transition-colors"
                  >
                    {formatTimeSlot(new Date(slot.start_time))}
                  </Button>
                )
              )
            ) : (
              <div className="h-full max-md:h-44 w-full flex justify-center items-center">
                <Typography className="text-center text-gray-500">
                  No open-time slots
                </Typography>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Back button - desktop */}
      {!isMobileView && (
        <div className="absolute bottom-6 left-6">
          <Button
            type="button"
            className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-400 md:hover:bg-blue-50 md:dark:hover:bg-blue-800/10"
            onClick={onBack}
            variant="ghost"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default DateTimeSelection;

