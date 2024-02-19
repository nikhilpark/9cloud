
import Upload from "@/components/Upload"
import FileList from "@/components/FileList"
import { useUser } from '@auth0/nextjs-auth0/client';
export default function Page() {
   

    return (
        <div>

            <Upload />
            <FileList/>
        </div>
    )
}