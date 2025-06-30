// pages/index.tsx
"use client";
import { Tab } from "@headlessui/react";
import SuggestFoodForm from "components/SuggestFoodForm";
import UploadAnalyzeForm from "components/UploadAnalyzeForm";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function HomePage() {
  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center">🍽️ Welcome to AI Food Analyzer</h1>
      <p className="text-center mt-2 mb-6 text-gray-600">Choose a method to analyze your food</p>

      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded bg-gray-100 p-1 mb-4">
          <Tab
            className={({ selected }) =>
              classNames(
                "w-full rounded py-2.5 text-sm font-medium leading-5",
                selected ? "bg-white shadow text-blue-700" : "text-gray-500 hover:bg-white/[0.12]"
              )
            }
          >
            🍜 Suggest Food
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                "w-full rounded py-2.5 text-sm font-medium leading-5",
                selected ? "bg-white shadow text-blue-700" : "text-gray-500 hover:bg-white/[0.12]"
              )
            }
          >
            📷 Analyze From Image
          </Tab>
        </Tab.List>

        <Tab.Panels className="bg-white rounded shadow p-4">
          <Tab.Panel>
            <SuggestFoodForm />
          </Tab.Panel>
          <Tab.Panel>
            <UploadAnalyzeForm />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </main>
  );
}