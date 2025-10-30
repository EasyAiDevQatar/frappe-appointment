/**
 * External dependencies.
 */
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";

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

const customerInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address"),
});

export type CustomerInfo = z.infer<typeof customerInfoSchema>;

interface CustomerInfoFormProps {
  onNext: (data: CustomerInfo) => void;
  initialData?: Partial<CustomerInfo>;
  isMobileView: boolean;
}

const CustomerInfoForm = ({
  onNext,
  initialData,
  isMobileView,
}: CustomerInfoFormProps) => {
  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: initialData?.name || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
    },
  });

  const onSubmit = (data: CustomerInfo) => {
    onNext(data);
  };

  return (
    <motion.div
      key="customer-info"
      className={`w-full md:h-[31rem] lg:w-[41rem] shrink-0 md:p-6 md:px-4`}
      initial={isMobileView ? {} : { x: "100%" }}
      animate={{ x: 0 }}
      exit={isMobileView ? {} : { x: "100%" }}
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
                Customer Information
              </Typography>
              <Typography className="text-sm text-muted-foreground">
                Step 1 of 4
              </Typography>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      form.formState.errors.name ? "text-red-500" : ""
                    }`}
                  >
                    Customer Name{" "}
                    <span className="text-red-500 dark:text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`active:ring-blue-400 focus-visible:ring-blue-400 ${
                        form.formState.errors.name
                          ? "active:ring-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                      placeholder="John Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={`${
                      form.formState.errors.name ? "text-red-500" : ""
                    }`}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      form.formState.errors.phone ? "text-red-500" : ""
                    }`}
                  >
                    Phone Number{" "}
                    <span className="text-red-500 dark:text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`active:ring-blue-400 focus-visible:ring-blue-400 ${
                        form.formState.errors.phone
                          ? "active:ring-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                      placeholder="+971 50 123 4567"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={`${
                      form.formState.errors.phone ? "text-red-500" : ""
                    }`}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      form.formState.errors.email ? "text-red-500" : ""
                    }`}
                  >
                    Email{" "}
                    <span className="text-red-500 dark:text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`active:ring-blue-400 focus-visible:ring-blue-400 ${
                        form.formState.errors.email
                          ? "active:ring-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={`${
                      form.formState.errors.email ? "text-red-500" : ""
                    }`}
                  />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end md:pt-4 max-md:h-14 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:w-screen max-md:border max-md:z-10 max-md:bg-background max-md:border-top max-md:items-center max-md:px-4">
            <Button
              className="bg-blue-500 dark:bg-blue-400 hover:bg-blue-500 dark:hover:bg-blue-400"
              type="submit"
            >
              Next <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default CustomerInfoForm;

