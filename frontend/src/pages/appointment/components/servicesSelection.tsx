/**
 * External dependencies.
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useFrappeGetCall } from "frappe-react-sdk";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/button";
import Typography from "@/components/typography";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/skeleton";

export interface Service {
  name: string;
  service_name: string;
  description?: string;
  duration?: number;
  price?: number;
}

export interface ServicesSelectionData {
  selectedServices: string[];
}

interface ServicesSelectionProps {
  onNext: (data: ServicesSelectionData) => void;
  onBack: () => void;
  initialData?: ServicesSelectionData;
  isMobileView: boolean;
}

const ServicesSelection = ({
  onNext,
  onBack,
  initialData,
  isMobileView,
}: ServicesSelectionProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialData?.selectedServices || []
  );

  const { data, isLoading } = useFrappeGetCall<{ message: Service[] }>(
    "frappe_appointment.api.personal_meet.get_appointment_services",
    undefined,
    undefined,
    {
      revalidateOnFocus: false,
    }
  );

  const services = data?.message || [];

  const toggleService = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleNext = () => {
    if (selectedServices.length > 0) {
      onNext({ selectedServices });
    }
  };

  return (
    <motion.div
      key="services-selection"
      className={`w-full md:h-[31rem] lg:w-[41rem] shrink-0 md:p-6 md:px-4`}
      initial={isMobileView ? {} : { x: "100%" }}
      animate={{ x: 0 }}
      exit={isMobileView ? {} : { x: "-100%" }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="space-y-6 h-full flex justify-between flex-col">
        <div className="space-y-4">
          <div className="flex gap-3 max-md:flex-col md:items-center md:justify-between">
            <Typography variant="p" className="text-2xl">
              Select Services
            </Typography>
            <Typography className="text-sm text-muted-foreground">
              Step 2 of 4
            </Typography>
          </div>

          <Typography className="text-sm text-muted-foreground">
            Choose one or more services you need
          </Typography>

          {/* Services Table */}
          <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2 p-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : services.length > 0 ? (
              <table className="w-full">
                <thead className="bg-blue-50 dark:bg-zinc-800 sticky top-0">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold">
                      Service
                    </th>
                    <th className="text-left p-3 text-sm font-semibold max-md:hidden">
                      Description
                    </th>
                    <th className="text-center p-3 text-sm font-semibold w-20">
                      Select
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr
                      key={service.name}
                      onClick={() => toggleService(service.name)}
                      className={cn(
                        "cursor-pointer border-t hover:bg-blue-50 dark:hover:bg-zinc-800/50 transition-colors",
                        selectedServices.includes(service.name) &&
                          "bg-blue-50 dark:bg-blue-900/20"
                      )}
                    >
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {service.service_name}
                          </span>
                          {service.duration && (
                            <span className="text-xs text-muted-foreground">
                              {service.duration} mins
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground max-md:hidden">
                        {service.description || "—"}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center">
                          <CheckCircle2
                            className={cn(
                              "w-6 h-6 transition-colors",
                              selectedServices.includes(service.name)
                                ? "text-blue-500 fill-blue-500"
                                : "text-gray-300 dark:text-gray-600"
                            )}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Typography>No services available at the moment</Typography>
              </div>
            )}
          </div>

          {selectedServices.length > 0 && (
            <div className="text-sm text-blue-500 dark:text-blue-400">
              {selectedServices.length} service(s) selected
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
            disabled={selectedServices.length === 0}
            className="bg-blue-500 dark:bg-blue-400 hover:bg-blue-500 dark:hover:bg-blue-400"
            onClick={handleNext}
          >
            Next <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServicesSelection;

