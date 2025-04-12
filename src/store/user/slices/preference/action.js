// import { userService } from "@/services/user"
import { merge } from "@/utils/merge"
import { setNamespace } from "@/utils/storeDebug"

const n = setNamespace("preference")

export const createPreferenceSlice = (set, get) => ({
    updateGuideState: async guide => {
        const { updatePreference } = get()
        const nextGuide = merge(get().preference.guide, guide)
        await updatePreference({ guide: nextGuide })
    },

    updatePreference: async (preference, action) => {
        const nextPreference = merge(get().preference, preference)

        set({ preference: nextPreference }, false, action || n("updatePreference"))
//todo: update preference
        // await userService.updatePreference(nextPreference)
    }
})
