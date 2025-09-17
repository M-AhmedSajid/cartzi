import { useState, useEffect } from 'react'
import { useDocumentOperation } from 'sanity'

export function SetUpdatedBySyncAndPublishAction(props) {
    const { patch, publish } = useDocumentOperation(props.id, props.type)
    const [isPublishing, setIsPublishing] = useState(false)

    useEffect(() => {
        if (isPublishing && !props.draft) {
            setIsPublishing(false)
        }
    }, [props.draft, isPublishing])

    return {
        disabled: publish.disabled,
        label: isPublishing ? 'Publishing…' : 'Publish',
        onHandle: () => {
            setIsPublishing(true)
            // Update the draft
            patch.execute([{ set: { updatedBySync: false } }])
            // Publish it
            publish.execute()
            props.onComplete()
        },
    }
}
