import { useState, useEffect } from "react";
import { useDocumentOperation } from "sanity";

export function SetUpdatedBySyncAndDeleteAction(props) {
    const { patch, delete: del } = useDocumentOperation(props.id, props.type);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isDeleting && !props.draft) {
            setIsDeleting(false);
        }
    }, [props.draft, isDeleting]);

    return {
        disabled: del.disabled,
        label: isDeleting ? "Deleting…" : "Delete",
        onHandle: () => {
            setIsDeleting(true);

            // Set updatedBySync to false
            patch.execute([{ set: { updatedBySync: false } }]);
            // Delete the document
            del.execute();

            props.onComplete?.();
        },
    };
}
