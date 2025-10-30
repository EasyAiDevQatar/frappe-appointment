# Frappe Appointments - New 4-Step Booking Workflow

## Overview
The booking workflow has been updated to provide a more comprehensive customer booking experience with the following 4-page flow:

### Page 1: Customer Information
- **Fields:** Customer Name, Phone Number, Email (all mandatory)
- **Purpose:** Collect essential customer contact information

### Page 2: Services Selection
- **Display:** Table showing all available services
- **Functionality:** Customers can select multiple services they need
- **Features:** Service name, description, duration, and selection checkbox

### Page 3: Meeting Location
- **Options:**
  - **Our Location:** Meeting at company office (Ebkar – Technology & Management Solutions, Dubai, UAE)
  - **Customer Location:** Customer provides their location details
    - Location (City/Area)
    - Street Name
    - Building Name and Number
    - Apartment Number (optional)

### Page 4: Date & Time Selection
- **Features:**
  - Calendar view with available dates
  - Time slot selection based on availability
  - Timezone selection
  - 12h/24h time format toggle

## Technical Changes

### New Components Created
1. **customerInfoForm.tsx** - Page 1 component
2. **servicesSelection.tsx** - Page 2 component
3. **meetingLocation.tsx** - Page 3 component
4. **dateTimeSelection.tsx** - Page 4 component
5. **multiStepBooking.tsx** - Main container managing the 4-step workflow

### New DocType
**Appointment Service**
- Fields:
  - Service Name (Data, mandatory, unique)
  - Description (Small Text)
  - Enabled (Check, default: 1)
  - Duration in Minutes (Int)
  - Price (Currency, AED)

### API Changes
1. **New API Endpoint:** `get_appointment_services()`
   - Returns list of all active appointment services
   - Accessible by guests

2. **Updated API Endpoint:** `book_time_slot()`
   - New parameters:
     - `customer_phone`: Customer's phone number
     - `selected_services`: JSON string of selected service IDs
     - `location_type`: "our_location" or "customer_location"
     - `our_location`: Company location address (if our_location)
     - `customer_location`: JSON string of customer location details

### Custom Fields Added to Event DocType
- `custom_customer_phone` (Data)
- `custom_selected_services` (Long Text)
- `custom_location_type` (Select)
- `custom_our_location` (Small Text)
- `custom_customer_location` (Long Text)

## Installation Instructions

### 1. Run Migration
To create the new Appointment Service doctype and apply custom fields:

```bash
cd /home/rust/erp15
bench --site [your-site-name] migrate
```

Replace `[your-site-name]` with your actual site (e.g., etms.local, antpos.local, etc.)

### 2. Clear Cache
```bash
bench --site [your-site-name] clear-cache
```

### 3. Build Frontend
The frontend build is already running in the background. Once complete, run:
```bash
bench --site [your-site-name] clear-website-cache
```

### 4. Create Appointment Services
Navigate to:
**Desk → Frappe Appointment → Appointment Service**

Create your service offerings with:
- Service Name (e.g., "IT Consultation", "System Setup", "Technical Support")
- Description
- Duration (in minutes)
- Price (in AED)
- Enable checkbox (checked)

Example services:
```
Service Name: IT Consultation
Description: Professional IT consultation for business needs
Duration: 60 minutes
Price: 500 AED
Enabled: ✓

Service Name: System Installation
Description: Complete system setup and installation
Duration: 120 minutes
Price: 1000 AED
Enabled: ✓

Service Name: Technical Support
Description: On-site technical support for your team
Duration: 90 minutes
Price: 750 AED
Enabled: ✓
```

## Configuration

### Update Company Location
Edit the default company location in:
`/home/rust/erp15/apps/frappe_appointment/frontend/src/pages/appointment/components/meetingLocation.tsx`

Line 60:
```typescript
const ourLocation = "Ebkar – Technology & Management Solutions, Dubai, UAE";
```

Replace with your actual company address.

## User Experience

### Customer Journey
1. Customer receives appointment booking URL
2. Fills in personal information (Name, Phone, Email)
3. Selects one or more services from the table
4. Chooses meeting location (company office or their location)
5. Picks preferred date and time from available slots
6. Confirms booking

### Features
- Mobile-responsive design
- Smooth page transitions
- Form validation on all steps
- Back button to navigate between steps
- Progress indicator (Step X of 4)
- Loading states for API calls
- Success confirmation with appointment details

## Testing

### Test the Booking Flow
1. Navigate to your appointment booking URL:
   `https://[your-domain]/schedule/in/[user-slug]`

2. Select a meeting duration

3. Complete all 4 steps:
   - Enter customer information
   - Select services
   - Choose location
   - Pick date and time

4. Verify the event is created with all custom fields populated

### Check Event Details
After booking, check the Event document in the backend:
- Customer name, email, phone should be captured
- Selected services should be stored
- Location type and details should be saved

## Troubleshooting

### Services Not Loading
- Ensure you've created at least one Appointment Service with "Enabled" checked
- Check browser console for API errors
- Verify the API endpoint: `/api/method/frappe_appointment.api.personal_meet.get_appointment_services`

### Custom Fields Not Showing
- Run migration: `bench --site [site-name] migrate`
- Clear cache: `bench --site [site-name] clear-cache`
- Restart bench: `bench restart`

### Frontend Not Updated
- Rebuild frontend: `cd /home/rust/erp15/apps/frappe_appointment/frontend && npm run build`
- Clear website cache: `bench --site [site-name] clear-website-cache`
- Hard refresh browser (Ctrl+Shift+R)

## Notes
- All previous functionality (reschedule, guests, etc.) remains intact
- The multi-step workflow only applies to new bookings
- Rescheduling still uses the original simplified flow
- Custom fields use the `custom_` prefix to avoid conflicts

## Support
For issues or questions, please check:
- Browser console for JavaScript errors
- Frappe error logs: `bench --site [site-name] logs`
- Network tab for API call failures

