import BackgroundJob from "react-native-background-job";
import { syncObjectValues } from "../store/PosStore/syncInBackground";

export function background_job_initialization(stores2) {
  BackgroundJob.cancel({ jobKey: "AutomaticSync" });
  const backgroundJob = {
    jobKey: "myJob",
    job: () => syncObjectValues("sync", stores2, true),
  };
  BackgroundJob.register(backgroundJob);
  let backgroundSchedule = {
    jobKey: "myJob",
    period: 360000,
    allowExecutionInForeground: true,
    networkType: BackgroundJob.NETWORK_TYPE_UNMETERED,
  };
  BackgroundJob.schedule(backgroundSchedule);
}
