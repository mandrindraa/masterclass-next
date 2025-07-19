import type { Student } from "@/types"

// Load jsPDF dynamically
const loadJsPDF = async () => {
  if (typeof window !== "undefined") {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    document.head.appendChild(script)

    return new Promise((resolve) => {
      script.onload = () => {
        resolve((window as any).jsPDF)
      }
    })
  }
}

export const generateReportCard = async (student: Student, period: string) => {
  const jsPDF = await loadJsPDF()
  const doc = new (jsPDF as any)()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  // Header
  doc.setFontSize(20)
  doc.setFont(undefined, "bold")
  doc.text("ACADEMIC REPORT CARD", pageWidth / 2, 30, { align: "center" })

  doc.setFontSize(14)
  doc.setFont(undefined, "normal")
  doc.text("Excellence Academy", pageWidth / 2, 45, { align: "center" })
  doc.text(`Academic Period: ${period}`, pageWidth / 2, 55, { align: "center" })

  // Student Information
  doc.setFontSize(12)
  doc.setFont(undefined, "bold")
  doc.text("STUDENT INFORMATION", 20, 80)

  doc.setFont(undefined, "normal")
  doc.text(`Name: ${student.name}`, 20, 95)
  doc.text(`Grade Level: ${student.grade}`, 20, 105)
  doc.text(`Student ID: ${student.id.toString().padStart(6, "0")}`, 20, 115)
  doc.text(`Email: ${student.email}`, 20, 125)

  // Academic Summary
  doc.setFont(undefined, "bold")
  doc.text("ACADEMIC SUMMARY", 20, 150)

  doc.setFont(undefined, "normal")
  doc.text(`Overall GPA: ${student.gpa}`, 20, 165)
  doc.text(`Total Credits: ${student.totalCredits}`, 20, 175)
  doc.text(`Attendance: ${student.attendance}%`, 20, 185)

  // Course Grades Table
  doc.setFont(undefined, "bold")
  doc.text("COURSE GRADES", 20, 210)

  // Table headers
  const tableStartY = 225
  doc.setFontSize(10)
  doc.text("Course Name", 20, tableStartY)
  doc.text("Teacher", 80, tableStartY)
  doc.text("Grade", 130, tableStartY)
  doc.text("Percentage", 150, tableStartY)
  doc.text("Credits", 180, tableStartY)

  // Draw header line
  doc.line(20, tableStartY + 3, 190, tableStartY + 3)

  // Course data
  doc.setFont(undefined, "normal")
  let currentY = tableStartY + 15
  student.courses.forEach((course) => {
    doc.text(course.name, 20, currentY)
    doc.text(course.teacher, 80, currentY)
    doc.text(course.grade, 130, currentY)
    doc.text(`${course.percentage}%`, 150, currentY)
    doc.text(course.credits.toString(), 180, currentY)
    currentY += 12
  })

  // Comments section
  if (student.comments) {
    doc.setFont(undefined, "bold")
    doc.text("TEACHER COMMENTS", 20, currentY + 20)

    doc.setFont(undefined, "normal")
    const splitComments = doc.splitTextToSize(student.comments, 170)
    doc.text(splitComments, 20, currentY + 35)
  }

  // Footer
  doc.setFontSize(8)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, pageHeight - 20)
  doc.text("Excellence Academy - Academic Report", pageWidth / 2, pageHeight - 20, { align: "center" })

  // Save the PDF
  doc.save(`${student.name.replace(/\s+/g, "_")}_Report_Card_${period.replace(/\s+/g, "_")}.pdf`)
}

export const generateBulkReports = async (students: Student[], period: string) => {
  for (const student of students) {
    await generateReportCard(student, period)
    // Add a small delay to prevent browser from being overwhelmed
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

export const exportStudentGradesToCSV = (students: Student[], period: string) => {
  const csvData = students.flatMap((student) =>
    student.courses.map((course) => ({
      "Student Name": student.name,
      "Student Email": student.email,
      "Grade Level": student.grade,
      "Course Name": course.name,
      Teacher: course.teacher,
      "Letter Grade": course.grade,
      Percentage: course.percentage,
      Credits: course.credits,
      GPA: student.gpa,
      Attendance: student.attendance,
      Period: period,
    })),
  )

  const headers = Object.keys(csvData[0])
  const csvContent = [
    headers.join(","),
    ...csvData.map((row) =>
      headers
        .map((header) => {
          const value = (row as any)[header]
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `Student_Grades_${period.replace(/\s+/g, "_")}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
