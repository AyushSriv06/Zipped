"use client"
import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@/components/buttons/DarkButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../config";
import { LinkButton } from "@/components/buttons/LinkButton";
import { useRouter } from "next/navigation";

interface Zip {
    "id": string,
    "triggerId": string,
    "userId": number,
    "actions": {
        "id": string,
        "zipId": string,
        "actionId": string,
        "sortingOrder": number,
        "type": {
            "id": string,
            "name": string
            "image": string
        }
    }[],
    "trigger": {
        "id": string,
        "zipId": string,
        "triggerId": string,
        "type": {
            "id": string,
            "name": string,
            "image": string
        }
    }
}

function useZips() {
    const [loading, setLoading] = useState(true);
    const [zips, setZips] = useState<Zip[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/zip`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
            .then(res => {
                setZips(res.data.zips);
                setLoading(false)
            })
    }, []);

    return {
        loading, zips
    }
}

export default function() {
    const { loading, zips } = useZips();
    const router = useRouter();
    
    return <div>
        <Appbar />
        <div className="flex justify-center pt-8">
            <div className="max-w-screen-lg	w-full">
                <div className="flex justify-between pr-8 ">
                    <div className="text-2xl font-bold">
                        My Zips
                    </div>
                    <DarkButton onClick={() => {
                        router.push("/zip/create");
                    }}>Create</DarkButton>
                </div>
            </div>
        </div>
        {loading ? "Loading..." : <div className="flex justify-center"> <ZipTable zips={zips} /> </div>}
    </div>
}

function ZipTable({ zips }: {zips: Zip[]}) {
    const router = useRouter();

    return <div className="p-8 max-w-screen-lg w-full">
        <div className="flex">
                <div className="flex-1">Name</div>
                <div className="flex-1">ID</div>
                <div className="flex-1">Created at</div>
                <div className="flex-1">Webhook URL</div>
                <div className="flex-1">Go</div>
        </div>
        {zips.map(z => <div className="flex border-b border-t py-4">
            <div className="flex-1 flex"><img src={z.trigger.type.image} className="w-[30px] h-[30px]" /> {z.actions.map(x => <img src={x.type.image} className="w-[30px] h-[30px]" />)}</div>
            <div className="flex-1">{z.id}</div>
            <div className="flex-1">MAR 16, 2025</div>
            <div className="flex-1">{`${HOOKS_URL}/hooks/catch/1/${z.id}`}</div>
            <div className="flex-1"><LinkButton onClick={() => {
                    router.push("/zip/" + z.id)
                }}>Go</LinkButton></div>
        </div>)}
    </div>
}
