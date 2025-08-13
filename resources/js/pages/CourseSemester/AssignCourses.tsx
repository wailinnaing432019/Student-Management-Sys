import { useState } from "react"
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { getSemesterText } from "@/Utils/SemesterText"

interface Major {
    id: number
    name: string
}
interface Semester {
    id: number
    semester_number: number
}
interface Course {
    id: number
    name: string
    code: string
}

interface Props {
    majors: Major[]
    semesters: Semester[]
    courses: Course[]
}

export default function AssignCourses({ majors, semesters, courses }: Props) {
    const [selectedMajor, setSelectedMajor] = useState<string>(String(majors[0]?.id || ""))
    const [selectedSemesters, setSelectedSemesters] = useState<Record<string, string>>({})
    const [selectedCourses, setSelectedCourses] = useState<Record<string, number[]>>({})

    const handleSemesterChange = (majorId: string, semesterId: string) => {
        setSelectedSemesters(prev => ({ ...prev, [majorId]: semesterId }))
    }

    const toggleCourse = (majorId: string, courseId: number) => {
        setSelectedCourses(prev => {
            const existing = prev[majorId] || []
            return {
                ...prev,
                [majorId]: existing.includes(courseId)
                    ? existing.filter(id => id !== courseId)
                    : [...existing, courseId],
            }
        })
    }

    const handleSubmit = () => {
        const payload = majors.map(major => ({
            major_id: major.id,
            semester_id: selectedSemesters[major.id],
            course_ids: selectedCourses[major.id] || [],
        }))
        console.log("Submitting:", payload)
        // You can send this via Inertia or axios etc.
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue={selectedMajor} onValueChange={setSelectedMajor}>
                <TabsList>
                    {majors.map(major => (
                        <TabsTrigger key={major.id} value={String(major.id)}>
                            {major.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {majors.map(major => (
                    <TabsContent key={major.id} value={String(major.id)} className="mt-4 space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Select Semester</span>
                            <Select
                                value={selectedSemesters[String(major.id)] || ""}
                                onValueChange={(val) => handleSemesterChange(String(major.id), val)}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Choose Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    {semesters.map(s => (
                                        <SelectItem key={s.id} value={String(s.id)}>
                                            {getSemesterText(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border p-4 rounded-lg">
                            {courses.map(course => (
                                <label key={course.id} className="flex items-center gap-2">
                                    <Checkbox
                                        checked={(selectedCourses[String(major.id)] || []).includes(course.id)}
                                        onCheckedChange={() => toggleCourse(String(major.id), course.id)}
                                    />
                                    <span>{course.name} ({course.code})</span>
                                </label>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            <Button onClick={handleSubmit}>Save Assignments</Button>
        </div>
    )
}
