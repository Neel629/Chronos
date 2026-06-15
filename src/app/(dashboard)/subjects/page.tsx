"use client";

import { motion } from "framer-motion";
import { BookOpen, Plus, Users, MapPin, Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const demoSubjects = [
  { id: "1", name: "Mathematics", short: "MATH", color: "#6366F1", instructor: "Dr. Sharma", room: "A-201", credits: 4 },
  { id: "2", name: "Physics", short: "PHY", color: "#F59E0B", instructor: "Prof. Gupta", room: "Lab 3", credits: 3 },
  { id: "3", name: "CS 101", short: "CS", color: "#10B981", instructor: "Dr. Patel", room: "B-105", credits: 4 },
  { id: "4", name: "English", short: "ENG", color: "#F43F5E", instructor: "Ms. Rao", room: "C-302", credits: 2 },
  { id: "5", name: "Design", short: "DES", color: "#A855F7", instructor: "Mr. Khan", room: "D-101", credits: 3 },
];

export default function SubjectsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Subjects
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {demoSubjects.length} subjects this semester
          </p>
        </div>
        <Button size="sm" className="w-fit shadow-lg shadow-primary/20 cursor-pointer">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Subject
        </Button>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demoSubjects.map((subject, i) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
              {/* Color strip */}
              <div className="h-1.5" style={{ backgroundColor: subject.color }} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-base">{subject.name}</h3>
                    <span className="text-xs text-muted-foreground font-medium">
                      {subject.short}
                    </span>
                  </div>
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: subject.color }}
                  >
                    {subject.short.charAt(0)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{subject.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{subject.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5 shrink-0" />
                    <span>{subject.credits} credits</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Add Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: demoSubjects.length * 0.06 }}
        >
          <Card className="h-full border-dashed hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 cursor-pointer group flex items-center justify-center min-h-[180px]">
            <CardContent className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
              <Plus className="h-8 w-8" />
              <span className="text-sm font-medium">Add Subject</span>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
