import BackgroundJob from "react-native-background-job";
import { syncObjectValues } from "../../store/PosStore/syncInBackground"
export function automatic_sync_background_job(props) {
    const backgroundJob = {
        jobKey: "AutomaticSync",
        job: () => syncObjectValues("sync", props, true),
    };
    BackgroundJob.register(backgroundJob);
    let backgroundSchedule = {
        jobKey: "AutomaticSync",
        period: 1,
        allowExecutionInForeground: true,
        networkType: BackgroundJob.NETWORK_TYPE_UNMETERED,
    };
    BackgroundJob.schedule(backgroundSchedule);

}