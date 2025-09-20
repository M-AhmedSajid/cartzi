import { createClient } from "@sanity/client";

import { apiVersion, dataset, projectId, writeToken } from "../env";

export const backendClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    token: writeToken
});
