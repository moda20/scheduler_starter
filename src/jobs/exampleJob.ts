import { JobConsumer } from "@jobConsumer/jobConsumer";
import { JobDTO, JobLogDTO, JobOptions } from "@types/models/job";

class ExampleJob extends JobConsumer {
    constructor() {
        super();
    }

    async run(job: JobDTO, jobLog: JobLogDTO, options: JobOptions) {
        console.log("running test job");
        this.logEvent("You are running the test job");
        console.log(options);
        const response  = await this.axios.get("https://www.google.com")
        this.logEvent("Got response from google")
        await this.exportResultsToFile({
            job_log_id: jobLog.id,
            fileName: "test",
            results: { googleTestResult: response.data },
        });
        await this.exportCacheFiles({
            job_log_id: jobLog.id,
            fileName: "test",
            data: { test: "test" },
            newFile: true,
        });
        return this.complete(jobLog, "");
    }
}

export default new ExampleJob();
