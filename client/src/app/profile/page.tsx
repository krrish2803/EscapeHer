"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import ProfileForm from "@/components/forms/ProfileForm";
import ContactList from "@/components/contacts/ContactList";
import ContactModal from "@/components/modals/ContactModal";
import { Plus } from "lucide-react";

// Demo contacts — TODO: replace with GET /api/contacts (Krrish)
const DEMO_CONTACTS = [
  { id: "1", name: "Aanya Sharma", relation: "Sister", phone: "+91 98765 43210", alertStatus: "idle" as const },
  { id: "2", name: "Priya Verma", relation: "Best friend", phone: "+91 87654 32109", alertStatus: "idle" as const },
  { id: "3", name: "Rohit (Dad)", relation: "Father", phone: "+91 76543 21098", alertStatus: "idle" as const },
];

export default function ProfilePage() {
  const [showAddContact, setShowAddContact] = useState(false);

  return (
    <DashboardLayout>
      <div className="px-4 md:px-8 py-8 space-y-8 max-w-4xl mx-auto eh-page">
        {/* Profile section */}
        <section aria-labelledby="profile-heading">
          <PageHeader
            id="profile-heading"
            title="Your Profile"
            subtitle="Manage your personal information."
          />
          <div
            className="mt-5 rounded-2xl p-6 border border-[var(--eh-mist-200)] bg-[var(--eh-surface)] shadow-sm"
          >
            <ProfileForm />
          </div>
        </section>

        {/* Trusted contacts section */}
        <section aria-labelledby="contacts-heading">
          <PageHeader
            id="contacts-heading"
            title="Trusted Contacts"
            subtitle="People alerted during an emergency session."
            action={
              <button
                type="button"
                onClick={() => setShowAddContact(true)}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold bg-[var(--eh-teal-500)] text-[var(--eh-surface)] hover:bg-[var(--eh-teal-500)]/95 shadow-sm transition-all active:scale-[0.97]"
              >
                <Plus size={14} />
                Add
              </button>
            }
          />
          <div className="mt-5">
            <ContactList
              contacts={DEMO_CONTACTS}
              onCall={(id) => console.log("[profile] call", id)}
              onMessage={(id) => console.log("[profile] message", id)}
            />
            {/* TODO: wire ContactModal onSave to POST /api/contacts (Krrish) */}
          </div>
        </section>
      </div>

      {/* Add contact modal — wrapped from UIKit */}
      <ContactModal
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        onSave={(contact) => {
          // TODO: POST contact to Krrish's API (fire-and-forget or wrap in async IIFE)
          console.log("[profile] save contact", contact);
          setShowAddContact(false);
        }}
      />
    </DashboardLayout>
  );
}
