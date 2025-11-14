import { createClient } from "redis";
import type { RedisClientType } from "redis";
import { envConfig } from "../config";

let redisClient: RedisClientType;

export async function getRedis() {
  if (!redisClient) {
    redisClient = createClient({
      url: envConfig.REDIS_URL,
    });

    redisClient.on("error", (err) => console.error("Redis Client Error", err));

    await redisClient.connect();
    console.log("connected to redis");
  }
  return redisClient;
}
