# Registration System - Edge Cases & Solutions Guide

## Overview
This document explains how the registration system handles edge cases for people from different backgrounds, those without email/phone access, and family/group registrations.

## Problems Addressed

### 1. **People Without Email/Phone**
**Problem:** Farmers, elderly people, or those from rural backgrounds may not have:
- A Gmail account or email they remember
- A personal phone number they can access

**Solution:**
- ✅ **Email is now OPTIONAL** - Users can leave it blank
- ✅ **Phone is now OPTIONAL** - Users can leave it blank
- ✅ **Placeholder Email Generation** - System automatically generates `noemail-{code}@event.local` for database consistency
- ✅ **Alternative Contact Field** - Users can provide relative's/neighbor's contact
- ✅ **Address Field** - For people without any digital contact method

### 2. **Family Members & Children**
**Problem:** People often come with:
- Spouses
- Children
- Parents
- Other family members

**Solution:**
- ✅ **Companions Registration** - Checkbox to add family members
- ✅ **Bulk Registration** - Register multiple people in one form
- ✅ **Relationship Tracking** - Track relationship (Spouse, Child, Parent, etc.)
- ✅ **Age Field** - For children and elderly
- ✅ **Linked Records** - Companions are linked to primary attendee in database
- ✅ **Individual QR Codes** - Each person gets their own QR code for entry

## Database Schema Updates

### New Fields in `Attendee` Model:

```prisma
// Contact fields (all optional)
email             String?   // Now optional
phone             String?   // Now optional
alternativeContact String?  // Relative's phone, neighbor's contact
address           String?   // Physical address

// Family/Group support
isPrimary         Boolean   @default(true)
primaryAttendeeId Int?      // Links companion to primary attendee
age               Int?      // For children/family members
relationship      String?   // "Spouse", "Child", "Parent", etc.

// Registration metadata
registeredBy      String?   // Admin/volunteer name
registrationNotes String?   // Special notes
```

## How It Works

### For People Without Email/Phone:

1. **Registration Process:**
   - User fills in name and designation (required)
   - Email and phone fields are optional with helpful messages
   - If no email provided, system generates placeholder: `noemail-GJ25-STU-XXXXX@event.local`
   - User can provide alternative contact (relative's phone, etc.)
   - User can provide physical address

2. **Identification:**
   - Each person gets a unique **Attendee Code** (e.g., `GJ25-STU-XXXXX`)
   - QR code is generated based on attendee code
   - Entry verification uses QR code, not email/phone

3. **Entry at Event:**
   - Watchmen scan QR code
   - System verifies using attendee code
   - No email/phone needed for entry

### For Family/Group Registration:

1. **Primary Attendee:**
   - First person fills their details
   - Checks "Registering with family members or companions?"

2. **Adding Companions:**
   - Click "+ Add Another Companion"
   - Fill in companion's name (required)
   - Optionally add:
     - Relationship (Spouse, Child, Parent, etc.)
     - Age
     - Designation (defaults to same as primary)

3. **Registration:**
   - All people registered in one submission
   - Each person gets their own:
     - Attendee code
     - QR code
     - Invitation card

4. **Database Structure:**
   - Primary attendee: `isPrimary = true`, `primaryAttendeeId = null`
   - Companions: `isPrimary = false`, `primaryAttendeeId = {primary_id}`
   - All linked for reporting

## Frontend Form Features

### Optional Fields with Helpful Messages:

```jsx
<label>Email (Optional - Leave blank if you don't have email)</label>
<p>💡 Don't have email? No problem! You can still register.</p>

<label>Phone (Optional - Leave blank if you don't have phone)</label>
<p>💡 No phone? You can provide a relative's or neighbor's contact below.</p>
```

### Alternative Contact Field:
- For people without their own phone/email
- Example: "Son's phone: 9876543210"
- Stored in `alternativeContact` field

### Address Field:
- For people without any digital contact
- Physical address stored for reference

### Family Registration UI:
- Checkbox: "Registering with family members or companions?"
- Dynamic form to add multiple companions
- Each companion has:
  - Name (required)
  - Relationship dropdown
  - Age input
  - Designation dropdown

## Backend Logic

### Email Handling:
```javascript
// If email provided, validate format
if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  return error('Invalid email format');
}

// Check uniqueness only if email provided
if (email) {
  const existing = await Attendee.findOne({ email });
  if (existing) return error('Email already registered');
}

// Generate placeholder if no email
const finalEmail = email || generatePlaceholderEmail(attendeeCode);
// Example: "noemail-gj25-stu-abc123@event.local"
```

### Companions Registration:
```javascript
// Create primary attendee first
const attendee = await Attendee.create({...primaryData});

// Then create companions linked to primary
for (const companion of companions) {
  await Attendee.create({
    ...companionData,
    isPrimary: false,
    primaryAttendeeId: attendee.id,
  });
}
```

## Best Practices for Event Organizers

### 1. **On-Site Registration Help:**
- Have volunteers/administrators help people without digital access
- Use "Registration Notes" field to document:
  - "Registered by son"
  - "No email access"
  - "Registered by volunteer: [name]"

### 2. **For Farmers/Rural Attendees:**
- Encourage them to provide:
  - Alternative contact (relative's phone)
  - Physical address
  - Any contact method they have

### 3. **For Families:**
- Register primary attendee first
- Add all family members as companions
- Each person gets their own QR code
- Children can be registered with age and relationship

### 4. **Entry Verification:**
- QR code scanning works for everyone
- No need for email/phone at entry
- Each person (including children) needs their own QR code

## Example Scenarios

### Scenario 1: Farmer Without Email/Phone
1. Name: "Ramesh Kumar"
2. Email: (leave blank)
3. Phone: (leave blank)
4. Alternative Contact: "Son's phone: 9876543210"
5. Address: "Village: XYZ, District: ABC"
6. Designation: "Guest"
7. **Result:** Registered with code `GJ25-GST-XXXXX`, QR code generated

### Scenario 2: Family Registration
1. Primary: "John Doe" (Alumni, 2010)
2. Check "Has companions"
3. Add companion 1: "Jane Doe" (Spouse, Guest)
4. Add companion 2: "Tom Doe" (Child, Age: 8, Guest)
5. **Result:** 3 people registered, 3 QR codes generated

### Scenario 3: Elderly Person Registered by Volunteer
1. Name: "Mrs. Shanti"
2. Email: (blank)
3. Phone: (blank)
4. Alternative Contact: "Daughter: 9876543210"
5. Registered By: "Volunteer: Priya"
6. Registration Notes: "Registered on behalf, no digital access"
7. **Result:** Registered successfully with placeholder email

## Migration Notes

⚠️ **Important:** After updating the schema, run:

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push
```

**Note:** Existing records will have:
- `email` and `phone` as required (existing data preserved)
- New records can have null values
- Consider migrating existing data if needed

## Testing Checklist

- [ ] Register without email
- [ ] Register without phone
- [ ] Register with alternative contact
- [ ] Register with address only
- [ ] Register family with 2+ companions
- [ ] Verify QR codes work for all registrations
- [ ] Test entry scanning for people without email/phone
- [ ] Verify companion linking in database

## Support & Troubleshooting

### Issue: "Email already registered" error
**Solution:** Only occurs if email is provided. Leave blank if no email.

### Issue: Can't register family members
**Solution:** Check "Registering with family members" checkbox first, then add companions.

### Issue: QR code not working
**Solution:** Each person needs their own QR code. Companions get separate codes.

## Future Enhancements

Potential improvements:
- Bulk import from Excel/CSV
- Admin panel for manual registration
- SMS/WhatsApp notifications (if phone provided)
- Print multiple cards at once
- Export family registrations

