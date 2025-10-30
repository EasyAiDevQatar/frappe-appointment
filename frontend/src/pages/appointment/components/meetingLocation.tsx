/**
 * External dependencies.
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/input";
import Typography from "@/components/typography";
import { cn } from "@/lib/utils";

const customerLocationSchema = z.object({
  location: z.string().min(3, "Location is required"),
  street: z.string().min(3, "Street name is required"),
  building: z.string().min(1, "Building name and number are required"),
  apartment: z.string().optional(),
});

export type CustomerLocationData = z.infer<typeof customerLocationSchema>;

export interface MeetingLocationData {
  locationType: "our_location" | "customer_location";
  ourLocation?: string;
  customerLocation?: CustomerLocationData;
}

interface MeetingLocationProps {
  onNext: (data: MeetingLocationData) => void;
  onBack: () => void;
  initialData?: MeetingLocationData;
  isMobileView: boolean;
}

const MeetingLocation = ({
  onNext,
  onBack,
  initialData,
  isMobileView,
}: MeetingLocationProps) => {
  const [locationType, setLocationType] = useState<
    "our_location" | "customer_location"
  >(initialData?.locationType || "our_location");

  // Default company location - you can make this configurable
  const ourLocation = "Ebkar – Technology & Management Solutions, Dubai, UAE";

  const form = useForm<CustomerLocationData>({
    resolver: zodResolver(customerLocationSchema),
    defaultValues: {
      location: initialData?.customerLocation?.location || "",
      street: initialData?.customerLocation?.street || "",
      building: initialData?.customerLocation?.building || "",
      apartment: initialData?.customerLocation?.apartment || "",
    },
  });

  const onSubmit = (data: CustomerLocationData) => {
    if (locationType === "our_location") {
      onNext({
        locationType: "our_location",
        ourLocation,
      });
    } else {
      onNext({
        locationType: "customer_location",
        customerLocation: data,
      });
    }
  };

  const handleNext = () => {
    if (locationType === "our_location") {
      onNext({
        locationType: "our_location",
        ourLocation,
      });
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <motion.div
      key="meeting-location"
      className={`w-full md:h-[31rem] lg:w-[41rem] shrink-0 md:p-6 md:px-4`}
      initial={isMobileView ? {} : { x: "100%" }}
      animate={{ x: 0 }}
      exit={isMobileView ? {} : { x: "-100%" }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 h-full flex justify-between flex-col"
        >
          <div className="space-y-4">
            <div className="flex gap-3 max-md:flex-col md:items-center md:justify-between">
              <Typography variant="p" className="text-2xl">
                Meeting Location
              </Typography>
              <Typography className="text-sm text-muted-foreground">
                Step 3 of 4
              </Typography>
            </div>

            <Typography className="text-sm text-muted-foreground">
              Where would you like the meeting to take place?
            </Typography>

            {/* Location Type Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setLocationType("our_location")}
                className={cn(
                  "p-4 border-2 rounded-lg text-left transition-all",
                  locationType === "our_location"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                )}
              >
                <MapPin
                  className={cn(
                    "w-6 h-6 mb-2",
                    locationType === "our_location"
                      ? "text-blue-500"
                      : "text-gray-400"
                  )}
                />
                <Typography className="font-medium">Our Location</Typography>
              </button>

              <button
                type="button"
                onClick={() => setLocationType("customer_location")}
                className={cn(
                  "p-4 border-2 rounded-lg text-left transition-all",
                  locationType === "customer_location"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                )}
              >
                <MapPin
                  className={cn(
                    "w-6 h-6 mb-2",
                    locationType === "customer_location"
                      ? "text-blue-500"
                      : "text-gray-400"
                  )}
                />
                <Typography className="font-medium">Your Location</Typography>
              </button>
            </div>

            {/* Location Details */}
            {locationType === "our_location" ? (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Typography className="text-sm font-medium mb-1">
                  Meeting will be held at:
                </Typography>
                <Typography className="text-sm text-muted-foreground">
                  {ourLocation}
                </Typography>
              </div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          form.formState.errors.location ? "text-red-500" : ""
                        }`}
                      >
                        Location{" "}
                        <span className="text-red-500 dark:text-red-600">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={`active:ring-blue-400 focus-visible:ring-blue-400 ${
                            form.formState.errors.location
                              ? "active:ring-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                          placeholder="City, Area"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage
                        className={`${
                          form.formState.errors.location ? "text-red-500" : ""
                        }`}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          form.formState.errors.street ? "text-red-500" : ""
                        }`}
                      >
                        Street Name{" "}
                        <span className="text-red-500 dark:text-red-600">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={`active:ring-blue-400 focus-visible:ring-blue-400 ${
                            form.formState.errors.street
                              ? "active:ring-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                          placeholder="Street Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage
                        className={`${
                          form.formState.errors.street ? "text-red-500" : ""
                        }`}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="building"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${
                          form.formState.errors.building ? "text-red-500" : ""
                        }`}
                      >
                        Building Name and Number{" "}
                        <span className="text-red-500 dark:text-red-600">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={`active:ring-blue-400 focus-visible:ring-blue-400 ${
                            form.formState.errors.building
                              ? "active:ring-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                          placeholder="Building Name, Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage
                        className={`${
                          form.formState.errors.building ? "text-red-500" : ""
                        }`}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apartment Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          className="active:ring-blue-400 focus-visible:ring-blue-400"
                          placeholder="Apt #"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <div className="flex justify-between md:pt-4 max-md:h-14 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:w-screen max-md:border max-md:z-10 max-md:bg-background max-md:border-top max-md:items-center max-md:px-4">
            <Button
              type="button"
              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-400 md:hover:bg-blue-50 md:dark:hover:bg-blue-800/10 max-md:px-0 max-md:hover:underline max-md:hover:bg-transparent"
              onClick={onBack}
              variant="ghost"
            >
              <ChevronLeft /> Back
            </Button>
            <Button
              className="bg-blue-500 dark:bg-blue-400 hover:bg-blue-500 dark:hover:bg-blue-400"
              onClick={handleNext}
              type="button"
            >
              Next <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default MeetingLocation;

