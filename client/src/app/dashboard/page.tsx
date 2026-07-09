"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import HeartbeatStatus from "@/components/emergency/HeartbeatStatus";
import EmergencyChart from "@/components/charts/EmergencyChart";
import ContactList from "@/components/contacts/ContactList";
import { useAuth } from "@/hooks/useAuth";

// Demo data — replace with API-fetched data via React Query
const DEMO_CHART_DATA = [
  { label: "Mon", resolvedSafely: 2, escalated: 0 },
  { label: "Tue", resolvedSafely: 1, escalated: 1 },
  { label: "Wed", resolvedSafely: 3, escalated: 0 },
  { label: "Thu", resolvedSafely: 0, escalated: 0 },
  { label: "Fri", resolvedSafely: 2, escalated: 1 },
  { label: "Sat", resolvedSafely: 1, escalated: 0 },
  { label: "Sun", resolvedSafely: 1, escalated: 0 },
];

const DEMO_CONTACTS = [
  { id: "1", name: "Aanya Sharma", relation: "Sister", phone: "+91 98765 43210", alertStatus: "notified" as const },
  { id: "2", name: "Priya Verma", relation: "Best friend", phone: "+91 87654 32109", alertStatus: "idle" as const },
  { id: "3", name: "Rohit (Dad)", relation: "Father", phone: "+91 76543 21098", alertStatus: "idle" as const },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const [greeting, setGreeting] = React.useState("Hello");

  React.useEffect(() => {
    const currentHour = new Date().getHours();
    const resolved =
      currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";
    const timer = setTimeout(() => {
      setGreeting(resolved);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="px-4 md:px-8 py-8 space-y-6 max-w-6xl mx-auto eh-page">
        {/* Greeting header */}
        <PageHeader
          title={`${greeting}, ${firstName} 👋`}
          subtitle="Your safety dashboard — everything in one place."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Heartbeat, Charts, Contacts */}
          <div className="lg:col-span-7 space-y-6">
            {/* Heartbeat status — shows session monitor state */}
            <HeartbeatStatus
              status="monitoring"
              intervalSeconds={30}
            />

            {/* Emergency chart — wrapped from UIKit */}
            <section aria-labelledby="chart-heading">
              <h2
                id="chart-heading"
                className="text-xs font-semibold uppercase tracking-wide mb-3"
                style={{ color: "var(--eh-ink-600)" }}
              >
                7-Day Incident Overview
              </h2>
              <div
                className="rounded-2xl p-4 border border-[var(--eh-mist-200)] bg-[var(--eh-surface)] shadow-sm"
              >
                <EmergencyChart data={DEMO_CHART_DATA} height={200} />
              </div>
            </section>

            {/* Trusted contacts — wrapped from UIKit */}
            <section aria-labelledby="contacts-heading">
              <h2
                id="contacts-heading"
                className="text-xs font-semibold uppercase tracking-wide mb-3"
                style={{ color: "var(--eh-ink-600)" }}
              >
                Trusted Contacts
              </h2>
              <ContactList
                contacts={DEMO_CONTACTS}
                onCall={(id) => console.log("[dashboard] call contact", id)}
                onMessage={(id) => console.log("[dashboard] message contact", id)}
              />
            </section>
          </div>

          {/* Right Column: Actions & Stats */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick actions */}
            <section aria-labelledby="quick-actions-heading">
              <h2
                id="quick-actions-heading"
                className="text-xs font-semibold uppercase tracking-wide mb-3"
                style={{ color: "var(--eh-ink-600)" }}
              >
                Quick Actions
              </h2>
              <QuickActions />
            </section>

            {/* Stats */}
            <section aria-labelledby="stats-heading">
              <h2
                id="stats-heading"
                className="text-xs font-semibold uppercase tracking-wide mb-3"
                style={{ color: "var(--eh-ink-600)" }}
              >
                Your Safety Stats
              </h2>
              <DashboardStats
                stats={{
                  totalIncidents: 10,
                  resolvedSafely: 9,
                  escalated: 1,
                  heartbeatUptime: 98,
                }}
              />
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
