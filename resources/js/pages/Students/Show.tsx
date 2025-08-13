import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import AppLayout from "@/layouts/app-layout"
import { Head, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"

export default function StudentShowPage({ studentEnrollment }: { studentEnrollment: any }) {
    if (!studentEnrollment || !studentEnrollment.student) {
        return <div className="p-4 text-center text-muted-foreground">Loading student data...</div>
    }
    const student = studentEnrollment.student
    const profile = studentEnrollment.student_semester_profile
    const semester = studentEnrollment.semester
    const major = studentEnrollment.major
    const donor = studentEnrollment.student_semester_profile.donor
    const academicYear = studentEnrollment.academic_year
    const registrationAgreement = studentEnrollment.student_semester_profile.registration_agreement ?? null

    const { data, setData, post, processing, errors } = useForm({
        status: studentEnrollment.status ?? 'pending',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('enroll-students.update-status', studentEnrollment.id))
    }
    useEffect(() => {
        window.print()
    }, [])
    return (
        <h1>Hello</h1>
    )
}
