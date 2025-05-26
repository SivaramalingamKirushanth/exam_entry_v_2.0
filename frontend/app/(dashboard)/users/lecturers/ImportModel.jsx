"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { multipleLecturersRegister } from "@/utils/apiRequests/auth.api";
import { GiCancel } from "react-icons/gi";
import Dropzone from "@/components/Dropzone";

const ImportModel = ({ isImportOpen, setIsImportOpen, importModelRef }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const onFormSubmitted = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await multipleLecturersRegister(formData);

      if (result.isFile) {
        toast.success("Failed records file downloaded.");
      } else {
        toast.success(result.message);
      }
    } catch (error) {
      toast.error("Operation failed. Please try again.");
      console.error("Error:", error);
    } finally {
      queryClient.invalidateQueries(["lecturers"]);
      setFile(null);
      setFormData({});
      setIsLoading(false);
      setIsImportOpen(false);
    }
  };

  return (
    <>
      {isImportOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={importModelRef}
            className="bg-white rounded-lg shadow-lg w-[425px] p-6"
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold">Lecturer</h3>
              <GiCancel
                className="text-2xl hover:cursor-pointer hover:text-zinc-700"
                onClick={() => {
                  setIsImportOpen(false);
                  setFile(null);
                  setFormData({});
                }}
              />
            </div>

            <div className="font-bahnschriftCon pl-5 mt-1">
              <h2 className="font-semibold">Instructions</h2>
              <ul className="list-disc text-sm">
                <li>Ensure the file is in CSV format.</li>
                <li>
                  The first row must be a header row, and the columns must be in
                  the following exact order:
                  <ol className="list-decimal list-inside">
                    <li>
                      <strong>Name</strong>
                    </li>
                    <li>
                      <strong>User name</strong>
                    </li>
                    <li>
                      <strong>Email</strong>
                    </li>
                    <li>
                      <strong>Contact no</strong>
                    </li>
                  </ol>
                </li>
                <li>
                  Each row after the header must represent a single lecturer.
                </li>
              </ul>
            </div>

            <div className="grid gap-4 py-2">
              <Dropzone file={file} setFile={setFile} />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                type="button"
                disabled={!file || isLoading}
                onClick={onFormSubmitted}
              >
                {isLoading ? "Importing..." : "Import"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImportModel;
