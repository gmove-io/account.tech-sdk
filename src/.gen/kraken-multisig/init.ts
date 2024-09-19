import * as account from "./account/structs";
import * as auth from "./auth/structs";
import * as coinOperations from "./coin-operations/structs";
import * as deps from "./deps/structs";
import * as executable from "./executable/structs";
import * as members from "./members/structs";
import * as multisig from "./multisig/structs";
import * as proposals from "./proposals/structs";
import * as thresholds from "./thresholds/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(members.Member);
loader.register(members.Members);
loader.register(deps.Dep);
loader.register(deps.Deps);
loader.register(auth.Auth);
loader.register(proposals.Approved);
loader.register(proposals.Created);
loader.register(proposals.Executed);
loader.register(proposals.Proposal);
loader.register(proposals.Proposals);
loader.register(thresholds.Role);
loader.register(thresholds.Thresholds);
loader.register(executable.Executable);
loader.register(multisig.Multisig);
loader.register(account.Account);
loader.register(account.Invite);
loader.register(account.Registry);
loader.register(coinOperations.ManageCoins);
 }