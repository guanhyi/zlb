import { Dependency } from "@wendellhu/redi";
import { STARTUP_TOKEN, StartupService } from "./services/startup.service";
import { HttpModule } from "../shared/http";
import { HTTP_INTERCEPTOR } from "../shared/http/interceptor";

export const RootProvider: Dependency<any>[] = [
  ...HttpModule.forRoot,

  [STARTUP_TOKEN, { useClass: StartupService }],
];
