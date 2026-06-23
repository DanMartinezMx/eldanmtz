import { getSearchIndex } from "@/lib/content";
import { Navigation } from "./Navigation";

export function NavWrapper() {
    const searchIndex = getSearchIndex();
    return <Navigation searchIndex={searchIndex} />;
}