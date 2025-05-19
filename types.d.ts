declare module "@types/pokemon" {
    export interface IPokemon {
        name: string;
        type: string;
        description: string;
        level: number;
        slug: string;
    }
    export interface PokemonDTO {
        name: string;
        type: string;
        description: string;
        level: number;
    }
}
declare module "@types/user" {
    import { Currency, Language } from "@types/globals";
    export interface IUser {
        _id: string;
        username: string;
        email: string;
        password: string;
        role: UserRole;
        identity: UserIdentity;
        preferences: UserPreferences;
        accountStatus: UserAccountStatus;
        createdAt: Date;
        updatedAt: Date;
    }
    export interface SignUpUserDto {
        username: string;
        email: string;
        password: string;
    }
    export interface SignInUserDto {
        email: string;
        password: string;
    }
    export enum UserRole {
        ADMIN = 2,
        USER = 1
    }
    export interface UserIdentity {
        firstName: string;
        lastName: string;
        fullName: string;
        profilePictureUrl?: string;
        birthDate: Date;
    }
    export interface UserPreferences {
        language: Language;
        currency: Currency;
        notifications: {
            email: {
                newsletter: boolean;
                message: boolean;
            };
            push: {
                message: boolean;
            };
        };
    }
    export interface UserAccountStatus {
        status: string;
        reason?: string;
        since?: Date;
    }
    export enum UserAccountStatusType {
        ACTIVE = "active",
        DEACTIVATED = "deactivated",
        SUSPENDED = "suspended"
    }
}
declare module "@types/globals" {
    export * from "@types/pokemon";
    export * from "@types/user";
    export enum Currency {
        EUR = 0,
        USD = 1
    }
    /**
     * @description
     * This is the language enum.
     */
    export enum Language {
        FR = 0,
        EN = 1
    }
}
declare module "@config/config" {
    import convict from "convict";
    const config: convict.Config<{
        env: string;
        appName: string;
        swaggerServer: boolean;
        server: {
            ip: string;
            port: number;
            logToConsole: boolean;
        };
        jobs: {
            targetFolderForJobs: string;
            jobsFileExtensions: string;
        };
        exportOutputFiles: boolean;
        files: {
            exportOutputFiles: boolean;
            exportCacheFiles: boolean;
            exportJobLogsToFiles: boolean;
            cacheFilesRootPath: string;
            outputFilesRootPath: string;
            databaseBackupRootPath: string;
        };
        DB: {
            host: string;
            port: number;
            username: string;
            password: string;
            schedulerDatabaseName: string;
        };
        BASE_DB: {
            host: string;
            port: number;
            username: string;
            password: string;
            databaseName: string;
            passwordSaltRounds: number;
        };
        gotify: {
            url: null;
            token: string;
            appToken: null;
            appErrorChannelToken: null;
        };
        grafana: {
            lokiUrl: null;
            username: null;
            password: null;
        };
        browserless: {
            url: null;
            token: string;
            timeout: number;
        };
    }>;
    export default config;
}
declare module "@utils/httpRequestConfig" {
    import axios from "axios";
    export default axios;
    export const lokiHttpService: import("axios").AxiosInstance;
    export const GotifyHttpService: import("axios").AxiosInstance;
    export const BrowserlessHttpService: import("axios").AxiosInstance;
}
declare module "@external/browserless" {
    export const get: (url: string, extraConfig?: {
        params?: {
            [key: string]: string;
        };
        scrape?: boolean;
        elements?: string;
    }) => Promise<import("axios").AxiosResponse<any, any>>;
    export const getJson: (url: string, extraConfig?: {
        params?: {
            [key: string]: string;
        };
        scrape?: boolean;
        elements?: string;
        timeout?: number;
        headers?: {
            [key: string]: string;
        };
    }) => Promise<import("axios").AxiosResponse<any, any>>;
}
declare module "@types/notifications" {
    export interface Notifications {
        sendJobFinishNotification(jobId: string, jobName: string, results: string, options?: {
            title: string;
            message: string;
            priority: number;
        }): Promise<any>;
        sendJobCrashNotification(jobId: string, jobName: string, error?: string, options?: {
            title: string;
            message: string;
            priority: number;
        }): Promise<any>;
    }
}
declare module "@utils/loggers" {
    import { Logger } from "pino";
    const JobLogger: (id: string, name: string) => Logger;
    const generalLogger: Logger<never, boolean>;
    export default generalLogger;
    export { JobLogger };
}
declare module "@notifications/gotify" {
    import { Notifications } from "@types/notifications";
    export class GotifyService implements Notifications {
        sendJobFinishNotification(jobId: string, jobName: string, results: string, options?: {
            title?: string;
            message?: string;
            priority?: number;
        }): Promise<any>;
        sendJobCrashNotification(jobId: string, jobName: string, error?: string, options?: {
            title?: string;
            message?: string;
            priority?: number;
        }): Promise<any>;
    }
}
declare module "prisma/index" {
    import { PrismaClient } from "@generated/prisma";
    import { PrismaClient as BasePrismaClient } from "@generated/prisma_base";
    /**
     * Create the prisma client
     */
    const createPrismaClient: () => Promise<[PrismaClient<import("@generated/prisma").Prisma.PrismaClientOptions, never, import("@generated/prisma/runtime/library").DefaultArgs>, BasePrismaClient<import("@generated/prisma_base").Prisma.PrismaClientOptions, never, import("@generated/prisma_base/runtime/library").DefaultArgs>]>;
    /**
     * Run prisma migrations programmatically, requires that you have node and the prisma cli installed
     */
    const runMigrations: () => void;
    /**
     * Run Base prisma migrations programmatically, requires that you have node and the prisma cli installed
     */
    const runBaseMigrations: () => void;
    export { createPrismaClient, runBaseMigrations, runMigrations };
}
declare module "@types/api/websocket" {
    export interface JobNotification {
        message: string;
    }
    export interface JobStartedNotification extends JobNotification {
        jobId: string;
        jobName: string;
        runningJobCount: number;
        isSingular: boolean;
        averageTime: number;
    }
    export enum JobNotificationTopics {
        JobStarted = "JobStarted",
        JobFinished = "JobFinished",
        JobFailed = "JobFailed",
        Status = "Status",
        NOOP = "NOOP"
    }
}
declare module "@api/websocket/mainSocket.service" {
    import { ElysiaWS } from "elysia/dist/ws";
    import { JobDTO } from "@types/models/job";
    const _default: {
        clients: {
            [key: string]: ElysiaWS<any, {}>;
        };
        socket: any;
        setWsClient(client: any, userId: string): void;
        broadcastMessage(message: any): void;
        sendJobStartingNotification(job: JobDTO, runningJobCount: number): void;
        sendJobEndingNotification(job: JobDTO, runningJobCount: number): void;
    };
    export default _default;
}
declare module "@utils/CurrentRunsManager" {
    import { JobDTO } from "@types/models/job";
    const _default_1: {
        runningJobs: Record<string, Record<string, JobDTO>>;
        initialized: Record<string, boolean>;
        startJob(job: JobDTO): void;
        endJob(job: JobDTO): void;
        isRunning(job: JobDTO): boolean;
        isInitialized(job: JobDTO): boolean;
        getRunningJobCount(): number;
    };
    export default _default_1;
}
declare module "@initialization/jobsManager" {
    import { JobDTO } from "@types/models/job";
    const startAllJobs: () => Promise<{
        stats: {
            startedJobs: number;
            foundJobs: number;
            errorStartingJobs: number;
        };
        results: ({
            success: boolean;
        } | {
            name: string;
            result: any;
        })[];
    }>;
    export const registerJobStartAndEndActions: (job: JobDTO) => void;
    export const registerSingularJobStartAndEndActions: (job: JobDTO) => void;
    export const unsubscribeFromAllLogs: (id: number) => {
        success: boolean;
    };
    export const deleteJobStartAndEndActions: (job: JobDTO) => void;
    export const saveJobLogs: (id: string, name: string) => Promise<boolean>;
    export { startAllJobs };
}
declare module "@initialization/ScheduleManager" {
    export function start(): Promise<{
        initResult: any;
        jobsStartResults: {
            stats: {
                startedJobs: number;
                foundJobs: number;
                errorStartingJobs: number;
            };
            results: ({
                success: boolean;
            } | {
                name: string;
                result: any;
            })[];
        };
    }>;
}
declare module "@initialization/index" {
    import type { PrismaClient } from "@generated/prisma";
    import { PrismaClient as BasePrismaClient } from "@generated/prisma_base";
    let prisma: PrismaClient;
    let basePrisma: BasePrismaClient;
    export const initialize: () => Promise<{
        managerResults: {
            initResult: any;
            jobsStartResults: {
                stats: {
                    startedJobs: number;
                    foundJobs: number;
                    errorStartingJobs: number;
                };
                results: ({
                    success: boolean;
                } | {
                    name: string;
                    result: any;
                })[];
            };
        };
    }>;
    export { basePrisma, prisma };
}
declare module "@types/models/outputFiles" {
    export interface OutputFile {
        id: string;
        job_log_id: string;
        created_at: Date;
        updated_at: Date;
        file_name: string;
        file_tags: string | null;
        file_path: string;
        file_size: number;
        file_type: string;
    }
    export interface cacheFile extends OutputFile {
        time_to_live: number;
    }
    export class OutputFileClass implements OutputFile {
        id: string;
        job_log_id: string;
        created_at: Date;
        updated_at: Date;
        file_name: string;
        file_tags: string | null;
        file_path: string;
        file_size: number;
        file_type: string;
        constructor(outputFile: OutputFile);
    }
    export class CacheFileClass extends OutputFileClass implements cacheFile {
        time_to_live: number;
        constructor(outputFile: cacheFile);
    }
    export interface newOutputFileConfig {
        fileName: string;
        data: any;
        tags: string | null;
        type: string;
        jobLogId: string;
        newFile?: boolean;
    }
    export interface newCacheFileConfig extends newOutputFileConfig {
        ttl: number;
    }
}
declare module "@utils/dayJs" {
    import dayjs from "dayjs";
    export default dayjs;
}
declare module "@repositories/cacheFiles" {
    import { newCacheFileConfig } from "@types/models/outputFiles";
    export const saveCacheFile: ({ fileName, data, tags, type, jobLogId, ttl, newFile, }: newCacheFileConfig) => Promise<{
        dbOutput: {
            id: number;
            job_log_id: string;
            created_at: Date;
            updated_at: Date;
            file_name: string;
            file_tags: string;
            file_path: string;
            file_size: bigint;
            time_to_live: bigint;
            file_type: string;
            last_downloaded: Date;
        };
        filePath: string;
    }>;
    export const getCacheFile: ({ filename }: {
        filename: string;
    }) => Promise<any>;
    export const getJobCacheFiles: ({ jobId, limit, offset, }: {
        jobId: string;
        limit?: number;
        offset?: number;
    }) => Promise<({
        cache_files: {
            id: number;
            job_log_id: string;
            created_at: Date;
            updated_at: Date;
            file_name: string;
            file_tags: string;
            file_path: string;
            file_size: bigint;
            time_to_live: bigint;
            file_type: string;
            last_downloaded: Date;
        }[];
    } & {
        error: string;
        result: string;
        job_log_id: string;
        job_id: number;
        machine: string;
        start_time: Date;
        end_time: Date;
    })[]>;
    export const getCacheFilePath: ({ id, fileName, }: {
        id: number;
        fileName: string;
    }) => Promise<string>;
    export const deleteCacheFile: ({ id, fileName, }: {
        id: number;
        fileName: string;
    }) => Promise<void>;
}
declare module "@repositories/outputFiles" {
    import { newOutputFileConfig } from "@types/models/outputFiles";
    export const saveNewFile: ({ fileName, data, tags, type, jobLogId, newFile, }: newOutputFileConfig) => Promise<{
        dbOutput: {
            id: number;
            job_log_id: string;
            created_at: Date;
            updated_at: Date;
            file_name: string;
            file_tags: string;
            file_path: string;
            file_size: bigint;
            file_type: string;
            last_downloaded: Date;
        };
        filePath: string;
    }>;
    export const getOutputFilePath: ({ id, fileName, }: {
        id: number;
        fileName: string;
    }) => Promise<string>;
    export const getJobOutputFiles: ({ jobId, limit, offset, }: {
        jobId: string;
        limit?: number;
        offset?: number;
    }) => Promise<({
        output_files: {
            id: number;
            job_log_id: string;
            created_at: Date;
            updated_at: Date;
            file_name: string;
            file_tags: string;
            file_path: string;
            file_size: bigint;
            file_type: string;
            last_downloaded: Date;
        }[];
    } & {
        error: string;
        result: string;
        job_log_id: string;
        job_id: number;
        machine: string;
        start_time: Date;
        end_time: Date;
    })[]>;
    export const deleteOutputFile: ({ id, fileName, }: {
        id: number;
        fileName: string;
    }) => Promise<void>;
}
declare module "@utils/jobUtils" {
    import { TSchema } from "elysia";
    export const Nullable: <T extends TSchema>(T: T) => import("@sinclair/typebox").TUnion<[T, import("@sinclair/typebox").TNull]>;
    /**
     * Get the next execution time of a cron job
     * @param cronSetting
     * @returns
     */
    export const getNextJobExecution: (cronSetting: string) => Date | null;
    /**
     * Sleep for a given number of seconds
     * @param seconds
     * @returns
     */
    export const sleep: (seconds?: number) => Promise<void>;
    /**
     * Export results to a file
     * @param results a jsonifiable object
     * @param fileName
     * @param job_log_id
     * @param tags extra tags to add as a file marker
     * @param type file type, nothing more than a tag
     * @param newFile setting this to True will remove from files and database any previous exported file with the same name
     * @async
     */
    export const exportResultsToFile: ({ results, fileName, job_log_id, tags, type, newFile, }: {
        results: any;
        fileName: string;
        job_log_id: string;
        tags?: any;
        type?: string;
        newFile?: boolean;
    }) => Promise<void>;
    /**
     * Export caches to a file, caches are a separated files from output files
     * and have a time to live number of 24h, by default
     * @param results a jsonifiable object
     * @param fileName
     * @param job_log_id
     * @param tags extra tags to add as a file marker
     * @param type file type, nothing more than a tag
     * @param ttl
     * @param newFile setting this to True will remove from files and database any previous exported file with the same name, defaults to true for caches
     * @async
     */
    export const exportCacheFiles: ({ data, fileName, job_log_id, tags, type, ttl, newFile, }: {
        data: any;
        fileName: string;
        job_log_id: string;
        tags?: any;
        type?: string;
        ttl?: number;
        newFile?: boolean;
    }) => Promise<void>;
    export const getFromCache: (fileName: string) => Promise<any>;
    /**
     * Convert a value to JSON string, takes into consideration BigInt
     * @param param  A jsonifiable object
     * @returns string
     */
    export const toJSON: (param: any) => any;
    /**
     * Find files recursively
     * @param dir
     * @param ext
     * @param files
     * @param result
     * @param regex
     */
    export const findFiles: (dir: string, ext: string[], regex?: RegExp, files?: string[], result?: string[]) => string[];
}
declare module "@utils/jobConsumerUtils" {
    import { exportCacheFiles, exportResultsToFile, getNextJobExecution, sleep } from "@utils/jobUtils";
    export { exportCacheFiles, exportResultsToFile, getNextJobExecution, sleep };
}
declare module "@types/models/job" {
    import config from "@config/config";
    import { schedule_job } from "@generated/prisma";
    import * as JobConsumerUtils from "@utils/jobConsumerUtils";
    import { IScheduleJob, IScheduleJobLog } from "schedule-manager";
    import { ScheduleJobTable } from "schedule-manager/dist/Classes/Entities/ScheduleJob";
    export interface JobDTO extends IScheduleJob {
        createdAt?: Date;
        id?: number;
        name: string;
        cronSetting: string;
        consumer: string;
        status: string;
        param: any;
        exclusive: boolean;
        uniqueSingularId?: string;
        averageTime: number;
        latestRun?: string | null;
        isCurrentlyRunning?: boolean;
        getId(): number | undefined;
        getName(): string;
        getParam(): any;
        getCronSetting(): string;
        getConsumer(): string;
        getExclusive(): boolean;
        getStats(): string;
        getAverageTime(): number;
        getUniqueSingularId(): string | undefined;
        getCreatedAt(): Date | undefined;
        getLatestRun(): any | null;
        setId(id: number): void;
        setName(name: string): void;
        setParam(param: any): void;
        setCronSetting(cronSetting: string): void;
        setConsumer(consumer: string): void;
        setExclusive(exclusive: boolean): void;
        setStatus(status: string): void;
        setUniqueSingularId(id: string | number): void;
        setCreatedAt(createdAt: string | Date): void;
        setAverageTime(averageTime: number): void;
        setLatestRun(latestRun: any | null): void;
    }
    export interface JobLogDTO extends IScheduleJobLog {
        id: string;
        jobId: number;
        machine: string;
        startTime: Date;
        endTime?: Date;
        result: string | null;
        logEventBus: any;
        error?: string;
        getId(): string;
        getJobId(): number;
        getMachine(): string;
        getStartTime(): Date;
        getEndTime(): Date | undefined;
        getResult(): string | null;
        getError(): string | undefined;
        getEventLogBus(): any;
        setEndTime(endTime: string): void;
        setResult(result: string): void;
        setError(error: string): void;
        setEventLogBus(eventLogBus: any): void;
    }
    export class JobDTOClass implements JobDTO {
        id?: number;
        name: string;
        param: any;
        cronSetting: string;
        consumer: string;
        exclusive: boolean;
        status: string;
        averageTime: number;
        latestRun: any | null;
        createdAt?: Date;
        uniqueSingularId?: string;
        isCurrentlyRunning?: boolean;
        initialized: boolean;
        jobLogs?: any[];
        constructor(job: schedule_job);
        getId(): number | undefined;
        getName(): string;
        getParam(): any;
        getCronSetting(): string;
        getConsumer(): string;
        getExclusive(): boolean;
        getStats(): string;
        getAverageTime(): number;
        getUniqueSingularId(): string | undefined;
        getCreatedAt(): Date | undefined;
        getLatestRun(): any | null;
        getIsCurrentlyRunning(): boolean | undefined;
        getIsInitialized(): boolean;
        setId(id: string | number | undefined): void;
        setName(name: string): void;
        setParam(param: any): void;
        setCronSetting(cronSetting: string): void;
        setConsumer(consumer: string): void;
        setExclusive(exclusive: boolean): void;
        setStatus(status: string): void;
        setUniqueSingularId(id: string): void;
        setAverageTime(averageTime: number): void;
        setCreatedAt(createdAt: string | Date): void;
        setLatestRun(latestRun: any | null): void;
        setIsCurrentlyRunning(isCurrentlyRunning: boolean): void;
        setInitialized(initialized: boolean): void;
        getJobUpdateObject(): ScheduleJobTable;
    }
    export const jobAttributeMap: Record<string, string>;
    export interface jobUpdateConfig {
        name: string;
        param?: any;
        consumer: string;
        cronSetting: string;
    }
    export enum jobActions {
        START = "START",
        STOP = "STOP",
        SOFT_DELETE = "SOFT_DELETE",
        CREATE = "CREATE",
        EXECUTE = "EXECUTE",
        UPDATE = "UPDATE"
    }
    export enum jobStatus {
        STOPPED = "STOPPED",
        DELETED = "DELETED",
        STARTED = "STARTED"
    }
    export interface JobStats {
        date: Date;
        averageDuration: number;
        totalRuns: number;
        totalRuntime: number;
        singularRunCount: number;
        errorCount: number;
    }
    export interface JobOptions {
        utils?: typeof JobConsumerUtils;
        config?: typeof config;
    }
}
declare module "@types/models/proxy" {
    import { proxy_status } from "@generated/prisma";
    import { JobDTO } from "@types/models/job";
    export interface ProxyDTO {
        id: number;
        proxy_ip: string;
        proxy_port: number;
        protocol: string;
        username: string;
        description: string;
        status: string;
        created_at: Date;
        updated_at: Date;
        proxy_job?: ProxyJobDTO[];
    }
    export interface ProxyJobDTO {
        id: number;
        proxy_id: number;
        job_id: number;
        created_at: Date;
        updated_at: Date;
        schedule_job: JobDTO;
    }
    export interface newProxyConfig {
        proxy_ip: string;
        proxy_port: number;
        protocol: string;
        username: string;
        password: string;
        description: string;
        status: proxy_status;
    }
    export interface proxyUpdateConfig {
        id: number;
        proxy_ip?: string;
        proxy_port?: number;
        protocol?: string;
        username?: string;
        password?: string;
        description?: string;
        status?: proxy_status;
    }
}
declare module "@repositories/proxies" {
    import { newProxyConfig, proxyUpdateConfig } from "@types/models/proxy";
    export const getAllProxies: ({ limit, offset, search, }: {
        limit?: number;
        offset?: number;
        search?: string;
    }) => Promise<({
        jobs: ({
            schedule_job: {
                created_at: Date;
                job_id: number;
                job_name: string;
                job_param: string;
                job_cron_setting: string;
                consumer: string;
                exclusive: string;
                status: string;
                average_time: number;
            };
        } & {
            id: number;
            created_at: Date;
            updated_at: Date;
            job_id: number;
            proxy_id: number;
        })[];
    } & {
        username: string;
        id: number;
        created_at: Date;
        updated_at: Date;
        status: import("@generated/prisma").$Enums.proxy_status;
        proxy_ip: string;
        proxy_port: number;
        protocol: string;
        description: string;
    })[]>;
    export const getJobProxies: (jobId: number, limit?: number, offset?: number) => import("@generated/prisma").Prisma.Prisma__schedule_jobClient<{
        proxies: ({
            proxy: {
                username: string;
                password: string;
                id: number;
                created_at: Date;
                updated_at: Date;
                status: import("@generated/prisma").$Enums.proxy_status;
                proxy_ip: string;
                proxy_port: number;
                protocol: string;
                description: string;
            };
        } & {
            id: number;
            created_at: Date;
            updated_at: Date;
            job_id: number;
            proxy_id: number;
        })[];
    } & {
        created_at: Date;
        job_id: number;
        job_name: string;
        job_param: string;
        job_cron_setting: string;
        consumer: string;
        exclusive: string;
        status: string;
        average_time: number;
    }, null, import("@generated/prisma/runtime/library").DefaultArgs, import("@generated/prisma").Prisma.PrismaClientOptions>;
    export const getProxy: (id: number) => Promise<{
        username: string;
        password: string;
        id: number;
        created_at: Date;
        updated_at: Date;
        status: import("@generated/prisma").$Enums.proxy_status;
        proxy_ip: string;
        proxy_port: number;
        protocol: string;
        description: string;
    }>;
    export const addProxy: ({ proxy_ip, proxy_port, protocol, username, password, description, status, }: newProxyConfig) => Promise<{
        username: string;
        password: string;
        id: number;
        created_at: Date;
        updated_at: Date;
        status: import("@generated/prisma").$Enums.proxy_status;
        proxy_ip: string;
        proxy_port: number;
        protocol: string;
        description: string;
    }>;
    export const updateProxy: ({ id, proxy_ip, proxy_port, protocol, username, password, description, status, }: proxyUpdateConfig) => Promise<{
        username: string;
        id: number;
        created_at: Date;
        updated_at: Date;
        status: import("@generated/prisma").$Enums.proxy_status;
        proxy_ip: string;
        proxy_port: number;
        protocol: string;
        description: string;
    }>;
    export const deleteProxy: (id: number) => Promise<{
        username: string;
        password: string;
        id: number;
        created_at: Date;
        updated_at: Date;
        status: import("@generated/prisma").$Enums.proxy_status;
        proxy_ip: string;
        proxy_port: number;
        protocol: string;
        description: string;
    }>;
    export const removeProxyFromJob: (id: number, job_id: number) => Promise<import("@generated/prisma").Prisma.BatchPayload>;
    export const addProxyToJob: (id: number, job_ids: number[]) => Promise<void>;
}
declare module "@utils/proxyUtils" {
    import type { AxiosInstance } from "axios";
    export const injectProxy: ({ jobId, axiosInstance, logger, }: {
        jobId: number;
        axiosInstance: AxiosInstance;
        logger?: any;
    }) => Promise<{
        password: string;
        username: string;
        id: number;
        created_at: Date;
        updated_at: Date;
        status: import("@generated/prisma").$Enums.proxy_status;
        proxy_ip: string;
        proxy_port: number;
        protocol: string;
        description: string;
    }>;
}
declare module "@jobConsumer/jobConsumer" {
    import * as BrowserlessService from "@external/browserless";
    import { GotifyService } from "@notifications/gotify";
    import { JobDTO, JobLogDTO, JobOptions } from "@types/models/job";
    import { exportCacheFiles, exportResultsToFile, getFromCache } from "@utils/jobUtils";
    import type { AxiosInstance } from "axios";
    const Consumer: typeof import("schedule-manager/dist/Classes/ScheduleJob/Consumer/JobConsumer").default;
    export class JobConsumer extends Consumer {
        axios: AxiosInstance;
        options?: JobOptions;
        notification: GotifyService;
        browserless: typeof BrowserlessService;
        constructor();
        getFromCache(...args: Parameters<typeof getFromCache>): Promise<any>;
        exportResultsToFile(...args: Parameters<typeof exportResultsToFile>): Promise<void>;
        exportCacheFiles(...args: Parameters<typeof exportCacheFiles>): Promise<void>;
        injectProxies(): Promise<void>;
        run(job: JobDTO, jobLog: JobLogDTO): Promise<{
            updateResult: {
                success: boolean;
            };
            jobUpdateResult: {
                success: boolean;
            };
        } | {
            success: boolean;
            err?: string;
        }>;
        preRun(job: JobDTO, jobLog: JobLogDTO): Promise<{
            updateResult: {
                success: boolean;
            };
            jobUpdateResult: {
                success: boolean;
            };
        } | {
            success: boolean;
            err?: string;
        }>;
    }
}
declare module "@types/index" {
    import { JobConsumer } from "@jobConsumer/jobConsumer";
    export type { JobConsumer };
    export * from "@types/models/job";
    export * from "@types/models/outputFiles";
    export * from "@types/models/proxy";
    export * from "@types/notifications";
    export * from "schedule-manager/dist";
}
declare module "@types/api/api-responses" {
    type APIResponse<TData = any> = {
        success: true;
        data: TData;
    } | APIError;
    type APIError = {
        success: false;
        message: string;
        errors?: string;
    };
    export type { APIError, APIResponse };
}
declare module "@types/api/index" {
    export * from "@types/api/api-responses";
    interface ÌCookieOptions {
        httpOnly: boolean;
        secure: boolean;
        sameSite: boolean | "strict" | "lax" | "none" | undefined;
        maxAge: number;
        path: string;
    }
    export interface ICookiesOptions {
        accessToken: ÌCookieOptions;
        refreshToken: ÌCookieOptions;
    }
}
declare module "@types/models/user" {
    export interface UserDTO {
        id: number;
        username: string;
        email: string;
        created_at: Date;
        updated_at: Date;
        cookie?: string;
    }
    export interface SignInUserDto {
        email: string;
        password: string;
    }
    export interface publicUserDTO {
        username: string;
        email: string;
        id?: string;
    }
    export interface NewUserConfig extends SignInUserDto {
        username: string;
    }
}
