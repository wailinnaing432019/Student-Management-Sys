{{-- resources/views/marks/show.blade.php --}}
<!DOCTYPE html>
<html>

<head>
    <title>Student Marks</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 8px;
            text-align: center;
        }

        th {
            background-color: #f4f4f4;
        }

        .header {
            margin-bottom: 20px;
        }

        @media print {
            table {
                page-break-inside: auto;
            }

            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }

            thead {
                display: table-header-group;
            }

            tfoot {
                display: table-footer-group;
            }
        }
    </style>
    <style>
        .header {
            margin-bottom: 20px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="header">
        <p><strong>{{ $academicYears->where('id', $selectedAcademicYearId)->first()?->name }} ပညာသင်နှစ်</strong>
        </p>
        @php
            $romanNumerals = [
                1 => 'I',
                2 => 'II',
                3 => 'III',
                4 => 'IV',
                5 => 'V',
                6 => 'VI',
                7 => 'VII',
                8 => 'VIII',
            ];

            $semesterNumber = $semesters->where('id', $selectedSemesterId)->first()?->semester_number;
        @endphp
        <p><strong>{{ $semesters->where('id', $selectedSemesterId)->first()?->year_name }} - Semester:
                {{ $romanNumerals[$semesterNumber] ?? $semesterNumber }} </strong></p>
        <p><strong> </strong> {{ $majors->where('id', $selectedMajorId)->first()?->name }}</p>
    </div>

    @php
        // Collect all unique courses from enrolled students
        $allCourses = collect();
        foreach ($enrollStudents as $enrollment) {
            foreach ($enrollment->studentCourses as $sc) {
                $allCourses->push($sc->course);
            }
        }
        $allCourses = $allCourses->unique('id')->values();
    @endphp

    <table>
        <thead>
            <tr>
                <th>စဉ်</th>
                <th>ကျောင်းသား</th>
                <th>ခုံနံပါတ်</th>
                @foreach ($allCourses as $course)
                    <th>{{ $course->name }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @forelse($enrollStudents as $enrollment)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $enrollment->student->name_myan }}</td>
                    <td>{{ $enrollment->studentSemesterProfile->roll_no }}</td>

                    @foreach ($allCourses as $course)
                        @php
                            $courseEnrollment = $enrollment->studentCourses->where('course_id', $course->id)->first();
                        @endphp
                        @if ($viewBy == 'grade')
                            <td>
                                {{ $courseEnrollment->mark->grade ?? '-' }}
                            </td>
                        @else
                            <td>
                                {{ $courseEnrollment->mark->mark ?? '-' }}
                            </td>
                        @endif
                    @endforeach
                </tr>
            @empty
                <tr>
                    <td colspan="{{ $allCourses->count() + 1 }}">No records found.</td>
                </tr>
            @endforelse

             
        </tbody>
    </table>
</body>

</html>
