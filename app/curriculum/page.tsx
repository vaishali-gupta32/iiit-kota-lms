"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // adjust import if your button component is different
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CurriculumPage() {
  const [pdfUrl] = useState("/curriculum.pdf"); // place curriculum.pdf inside public/ folder

  return (
    <div className="p-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Curriculum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* PDF Preview */}
          <div className="w-full h-[600px] border rounded-lg overflow-hidden">
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="Curriculum PDF"
            />
          </div>

          {/* Download Button */}
          <div className="flex justify-end">
            <a href={pdfUrl} download="Curriculum.pdf">
              <Button variant="default">Download PDF</Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
