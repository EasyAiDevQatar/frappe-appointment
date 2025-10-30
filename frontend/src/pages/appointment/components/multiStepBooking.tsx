/**
 * External dependencies.
 */
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useFrappePostCall } from "frappe-react-sdk";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";

/**
 * Internal dependencies.
 */
import CustomerInfoForm, { CustomerInfo } from "./customerInfoForm";
import ServicesSelection, { ServicesSelectionData } from "./servicesSelection";
import MeetingLocation, { MeetingLocationData } from "./meetingLocation";
import DateTimeSelection, { DateTimeSelectionData } from "./dateTimeSelection";
import { parseFrappeErrorMsg, getTimeZoneOffsetFromTimeZoneString } from "@/lib/utils";
import Spinner from "@/components/spinner";
import SuccessAlert from "@/components/success-alert";
import { useAppContext } from "@/context/app";

interface MultiStepBookingProps {
  durationId: string;
  onCancel: () => void;
  isMobileView: boolean;
}

export interface BookingFormData {
  customerInfo?: CustomerInfo;
  services?: ServicesSelectionData;
  location?: MeetingLocationData;
  dateTime?: DateTimeSelectionData;
}

const MultiStepBooking = ({
  durationId,
  onCancel,
  isMobileView,
}: MultiStepBookingProps) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<BookingFormData>({});
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");
  const [expanded, setExpanded] = useState(false);
  const [bookingResponse, setBookingResponse] = useState<any>(null);
  const [appointmentScheduled, setAppointmentScheduled] = useState(false);
  
  const { selectedSlot, timeZone } = useAppContext();
  const { call: bookAppointment, loading } = useFrappePostCall(
    "frappe_appointment.api.personal_meet.book_time_slot"
  );

  const handleCustomerInfoNext = (data: CustomerInfo) => {
    setFormData({ ...formData, customerInfo: data });
    setCurrentStep(2);
  };

  const handleServicesNext = (data: ServicesSelectionData) => {
    setFormData({ ...formData, services: data });
    setCurrentStep(3);
  };

  const handleLocationNext = (data: MeetingLocationData) => {
    setFormData({ ...formData, location: data });
    setCurrentStep(4);
  };

  const handleDateTimeNext = (data: DateTimeSelectionData) => {
    setFormData({ ...formData, dateTime: data });
    // Now submit the complete booking
    submitBooking({ ...formData, dateTime: data });
  };

  const submitBooking = async (completeData: BookingFormData) => {
    if (
      !completeData.customerInfo ||
      !completeData.services ||
      !completeData.location ||
      !completeData.dateTime
    ) {
      toast("Missing required information", {
        duration: 4000,
        icon: <CircleAlert className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    const meetingData = {
      duration_id: durationId,
      date: new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }).format(completeData.dateTime.date),
      user_timezone_offset: String(
        getTimeZoneOffsetFromTimeZoneString(completeData.dateTime.timeZone)
      ),
      start_time: completeData.dateTime.startTime,
      end_time: completeData.dateTime.endTime,
      user_name: completeData.customerInfo.name,
      user_email: completeData.customerInfo.email,
      customer_phone: completeData.customerInfo.phone,
      selected_services: JSON.stringify(completeData.services.selectedServices),
      location_type: completeData.location.locationType,
      our_location:
        completeData.location.locationType === "our_location"
          ? completeData.location.ourLocation
          : undefined,
      customer_location:
        completeData.location.locationType === "customer_location"
          ? JSON.stringify(completeData.location.customerLocation)
          : undefined,
    };

    bookAppointment(meetingData)
      .then((data) => {
        setBookingResponse(data.message);
        setAppointmentScheduled(true);
      })
      .catch((err) => {
        const error = parseFrappeErrorMsg(err);
        toast(error || "Something went wrong", {
          duration: 4000,
          classNames: {
            actionButton:
              "group-[.toast]:!bg-red-500 group-[.toast]:hover:!bg-red-300 group-[.toast]:!text-white",
          },
          icon: <CircleAlert className="h-5 w-5 text-red-500" />,
          action: {
            label: "OK",
            onClick: () => toast.dismiss(),
          },
        });
      });
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg flex items-center gap-3">
            <Spinner />
            <span>Booking your appointment...</span>
          </div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <CustomerInfoForm
            key="step-1"
            onNext={handleCustomerInfoNext}
            initialData={formData.customerInfo}
            isMobileView={isMobileView}
          />
        )}
        {currentStep === 2 && (
          <ServicesSelection
            key="step-2"
            onNext={handleServicesNext}
            onBack={() => setCurrentStep(1)}
            initialData={formData.services}
            isMobileView={isMobileView}
          />
        )}
        {currentStep === 3 && (
          <MeetingLocation
            key="step-3"
            onNext={handleLocationNext}
            onBack={() => setCurrentStep(2)}
            initialData={formData.location}
            isMobileView={isMobileView}
          />
        )}
        {currentStep === 4 && (
          <DateTimeSelection
            key="step-4"
            onNext={handleDateTimeNext}
            onBack={() => setCurrentStep(3)}
            durationId={durationId}
            isMobileView={isMobileView}
            displayMonth={displayMonth}
            setDisplayMonth={setDisplayMonth}
            timeFormat={timeFormat}
            setTimeFormat={setTimeFormat}
            expanded={expanded}
            setExpanded={setExpanded}
          />
        )}
      </AnimatePresence>

      {selectedSlot?.start_time && bookingResponse && (
        <SuccessAlert
          open={appointmentScheduled}
          setOpen={setAppointmentScheduled}
          selectedSlot={selectedSlot}
          onClose={onCancel}
          meetingProvider={bookingResponse.meeting_provider}
          meetLink={bookingResponse.meet_link}
          rescheduleLink={bookingResponse.reschedule_url}
          calendarString={bookingResponse.google_calendar_event_url}
          disableClose={false}
        />
      )}
    </>
  );
};

export default MultiStepBooking;

