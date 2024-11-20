import * as reified from "../../_framework/reified";
import {String} from "../../_dependencies/source/0x1/string/structs";
import {UID} from "../../_dependencies/source/0x2/object/structs";
import {VecSet} from "../../_dependencies/source/0x2/vec-set/structs";
import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, fieldToJSON, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../_framework/util";
import {Vector} from "../../_framework/vector";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64, fromHEX, toHEX} from "@mysten/sui/utils";

/* ============================== Role =============================== */

export function isRole(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::multisig::Role`; }

export interface RoleFields { name: ToField<String>; threshold: ToField<"u64"> }

export type RoleReified = Reified< Role, RoleFields >;

export class Role implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::multisig::Role`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Role.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::multisig::Role`; readonly $typeArgs: []; readonly $isPhantom = Role.$isPhantom;

 readonly name: ToField<String>; readonly threshold: ToField<"u64">

 private constructor(typeArgs: [], fields: RoleFields, ) { this.$fullTypeName = composeSuiType( Role.$typeName, ...typeArgs ) as `${typeof PKG_V1}::multisig::Role`; this.$typeArgs = typeArgs;

 this.name = fields.name;; this.threshold = fields.threshold; }

 static reified( ): RoleReified { return { typeName: Role.$typeName, fullTypeName: composeSuiType( Role.$typeName, ...[] ) as `${typeof PKG_V1}::multisig::Role`, typeArgs: [ ] as [], isPhantom: Role.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Role.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Role.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Role.fromBcs( data, ), bcs: Role.bcs, fromJSONField: (field: any) => Role.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Role.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Role.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Role.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Role.fetch( client, id, ), new: ( fields: RoleFields, ) => { return new Role( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Role.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Role>> { return phantom(Role.reified( )); } static get p() { return Role.phantom() }

 static get bcs() { return bcs.struct("Role", {

 name: String.bcs, threshold: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): Role { return Role.reified( ).new( { name: decodeFromFields(String.reified(), fields.name), threshold: decodeFromFields("u64", fields.threshold) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Role { if (!isRole(item.type)) { throw new Error("not a Role type");

 }

 return Role.reified( ).new( { name: decodeFromFieldsWithTypes(String.reified(), item.fields.name), threshold: decodeFromFieldsWithTypes("u64", item.fields.threshold) } ) }

 static fromBcs( data: Uint8Array ): Role { return Role.fromFields( Role.bcs.parse(data) ) }

 toJSONField() { return {

 name: this.name,threshold: this.threshold.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Role { return Role.reified( ).new( { name: decodeFromJSONField(String.reified(), field.name), threshold: decodeFromJSONField("u64", field.threshold) } ) }

 static fromJSON( json: Record<string, any> ): Role { if (json.$typeName !== Role.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Role.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Role { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isRole(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Role object`); } return Role.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Role { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isRole(data.bcs.type)) { throw new Error(`object at is not a Role object`); }

 return Role.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Role.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Role> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Role object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isRole(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Role object`); }

 return Role.fromSuiObjectData( res.data ); }

 }

/* ============================== Approvals =============================== */

export function isApprovals(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::multisig::Approvals`; }

export interface ApprovalsFields { totalWeight: ToField<"u64">; roleWeight: ToField<"u64">; approved: ToField<VecSet<"address">> }

export type ApprovalsReified = Reified< Approvals, ApprovalsFields >;

export class Approvals implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::multisig::Approvals`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Approvals.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::multisig::Approvals`; readonly $typeArgs: []; readonly $isPhantom = Approvals.$isPhantom;

 readonly totalWeight: ToField<"u64">; readonly roleWeight: ToField<"u64">; readonly approved: ToField<VecSet<"address">>

 private constructor(typeArgs: [], fields: ApprovalsFields, ) { this.$fullTypeName = composeSuiType( Approvals.$typeName, ...typeArgs ) as `${typeof PKG_V1}::multisig::Approvals`; this.$typeArgs = typeArgs;

 this.totalWeight = fields.totalWeight;; this.roleWeight = fields.roleWeight;; this.approved = fields.approved; }

 static reified( ): ApprovalsReified { return { typeName: Approvals.$typeName, fullTypeName: composeSuiType( Approvals.$typeName, ...[] ) as `${typeof PKG_V1}::multisig::Approvals`, typeArgs: [ ] as [], isPhantom: Approvals.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Approvals.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Approvals.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Approvals.fromBcs( data, ), bcs: Approvals.bcs, fromJSONField: (field: any) => Approvals.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Approvals.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Approvals.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Approvals.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Approvals.fetch( client, id, ), new: ( fields: ApprovalsFields, ) => { return new Approvals( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Approvals.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Approvals>> { return phantom(Approvals.reified( )); } static get p() { return Approvals.phantom() }

 static get bcs() { return bcs.struct("Approvals", {

 total_weight: bcs.u64(), role_weight: bcs.u64(), approved: VecSet.bcs(bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }))

}) };

 static fromFields( fields: Record<string, any> ): Approvals { return Approvals.reified( ).new( { totalWeight: decodeFromFields("u64", fields.total_weight), roleWeight: decodeFromFields("u64", fields.role_weight), approved: decodeFromFields(VecSet.reified("address"), fields.approved) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Approvals { if (!isApprovals(item.type)) { throw new Error("not a Approvals type");

 }

 return Approvals.reified( ).new( { totalWeight: decodeFromFieldsWithTypes("u64", item.fields.total_weight), roleWeight: decodeFromFieldsWithTypes("u64", item.fields.role_weight), approved: decodeFromFieldsWithTypes(VecSet.reified("address"), item.fields.approved) } ) }

 static fromBcs( data: Uint8Array ): Approvals { return Approvals.fromFields( Approvals.bcs.parse(data) ) }

 toJSONField() { return {

 totalWeight: this.totalWeight.toString(),roleWeight: this.roleWeight.toString(),approved: this.approved.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Approvals { return Approvals.reified( ).new( { totalWeight: decodeFromJSONField("u64", field.totalWeight), roleWeight: decodeFromJSONField("u64", field.roleWeight), approved: decodeFromJSONField(VecSet.reified("address"), field.approved) } ) }

 static fromJSON( json: Record<string, any> ): Approvals { if (json.$typeName !== Approvals.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Approvals.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Approvals { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isApprovals(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Approvals object`); } return Approvals.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Approvals { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isApprovals(data.bcs.type)) { throw new Error(`object at is not a Approvals object`); }

 return Approvals.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Approvals.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Approvals> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Approvals object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isApprovals(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Approvals object`); }

 return Approvals.fromSuiObjectData( res.data ); }

 }

/* ============================== ConfigMultisigAction =============================== */

export function isConfigMultisigAction(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::multisig::ConfigMultisigAction`; }

export interface ConfigMultisigActionFields { config: ToField<Multisig> }

export type ConfigMultisigActionReified = Reified< ConfigMultisigAction, ConfigMultisigActionFields >;

export class ConfigMultisigAction implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::multisig::ConfigMultisigAction`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = ConfigMultisigAction.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::multisig::ConfigMultisigAction`; readonly $typeArgs: []; readonly $isPhantom = ConfigMultisigAction.$isPhantom;

 readonly config: ToField<Multisig>

 private constructor(typeArgs: [], fields: ConfigMultisigActionFields, ) { this.$fullTypeName = composeSuiType( ConfigMultisigAction.$typeName, ...typeArgs ) as `${typeof PKG_V1}::multisig::ConfigMultisigAction`; this.$typeArgs = typeArgs;

 this.config = fields.config; }

 static reified( ): ConfigMultisigActionReified { return { typeName: ConfigMultisigAction.$typeName, fullTypeName: composeSuiType( ConfigMultisigAction.$typeName, ...[] ) as `${typeof PKG_V1}::multisig::ConfigMultisigAction`, typeArgs: [ ] as [], isPhantom: ConfigMultisigAction.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => ConfigMultisigAction.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => ConfigMultisigAction.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => ConfigMultisigAction.fromBcs( data, ), bcs: ConfigMultisigAction.bcs, fromJSONField: (field: any) => ConfigMultisigAction.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => ConfigMultisigAction.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => ConfigMultisigAction.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => ConfigMultisigAction.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => ConfigMultisigAction.fetch( client, id, ), new: ( fields: ConfigMultisigActionFields, ) => { return new ConfigMultisigAction( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return ConfigMultisigAction.reified() }

 static phantom( ): PhantomReified<ToTypeStr<ConfigMultisigAction>> { return phantom(ConfigMultisigAction.reified( )); } static get p() { return ConfigMultisigAction.phantom() }

 static get bcs() { return bcs.struct("ConfigMultisigAction", {

 config: Multisig.bcs

}) };

 static fromFields( fields: Record<string, any> ): ConfigMultisigAction { return ConfigMultisigAction.reified( ).new( { config: decodeFromFields(Multisig.reified(), fields.config) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): ConfigMultisigAction { if (!isConfigMultisigAction(item.type)) { throw new Error("not a ConfigMultisigAction type");

 }

 return ConfigMultisigAction.reified( ).new( { config: decodeFromFieldsWithTypes(Multisig.reified(), item.fields.config) } ) }

 static fromBcs( data: Uint8Array ): ConfigMultisigAction { return ConfigMultisigAction.fromFields( ConfigMultisigAction.bcs.parse(data) ) }

 toJSONField() { return {

 config: this.config.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): ConfigMultisigAction { return ConfigMultisigAction.reified( ).new( { config: decodeFromJSONField(Multisig.reified(), field.config) } ) }

 static fromJSON( json: Record<string, any> ): ConfigMultisigAction { if (json.$typeName !== ConfigMultisigAction.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return ConfigMultisigAction.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): ConfigMultisigAction { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isConfigMultisigAction(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a ConfigMultisigAction object`); } return ConfigMultisigAction.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): ConfigMultisigAction { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isConfigMultisigAction(data.bcs.type)) { throw new Error(`object at is not a ConfigMultisigAction object`); }

 return ConfigMultisigAction.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return ConfigMultisigAction.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<ConfigMultisigAction> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching ConfigMultisigAction object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isConfigMultisigAction(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a ConfigMultisigAction object`); }

 return ConfigMultisigAction.fromSuiObjectData( res.data ); }

 }

/* ============================== ConfigMultisigProposal =============================== */

export function isConfigMultisigProposal(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::multisig::ConfigMultisigProposal`; }

export interface ConfigMultisigProposalFields { dummyField: ToField<"bool"> }

export type ConfigMultisigProposalReified = Reified< ConfigMultisigProposal, ConfigMultisigProposalFields >;

export class ConfigMultisigProposal implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::multisig::ConfigMultisigProposal`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = ConfigMultisigProposal.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::multisig::ConfigMultisigProposal`; readonly $typeArgs: []; readonly $isPhantom = ConfigMultisigProposal.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: ConfigMultisigProposalFields, ) { this.$fullTypeName = composeSuiType( ConfigMultisigProposal.$typeName, ...typeArgs ) as `${typeof PKG_V1}::multisig::ConfigMultisigProposal`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): ConfigMultisigProposalReified { return { typeName: ConfigMultisigProposal.$typeName, fullTypeName: composeSuiType( ConfigMultisigProposal.$typeName, ...[] ) as `${typeof PKG_V1}::multisig::ConfigMultisigProposal`, typeArgs: [ ] as [], isPhantom: ConfigMultisigProposal.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => ConfigMultisigProposal.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => ConfigMultisigProposal.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => ConfigMultisigProposal.fromBcs( data, ), bcs: ConfigMultisigProposal.bcs, fromJSONField: (field: any) => ConfigMultisigProposal.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => ConfigMultisigProposal.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => ConfigMultisigProposal.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => ConfigMultisigProposal.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => ConfigMultisigProposal.fetch( client, id, ), new: ( fields: ConfigMultisigProposalFields, ) => { return new ConfigMultisigProposal( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return ConfigMultisigProposal.reified() }

 static phantom( ): PhantomReified<ToTypeStr<ConfigMultisigProposal>> { return phantom(ConfigMultisigProposal.reified( )); } static get p() { return ConfigMultisigProposal.phantom() }

 static get bcs() { return bcs.struct("ConfigMultisigProposal", {

 dummy_field: bcs.bool()

}) };

 static fromFields( fields: Record<string, any> ): ConfigMultisigProposal { return ConfigMultisigProposal.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummy_field) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): ConfigMultisigProposal { if (!isConfigMultisigProposal(item.type)) { throw new Error("not a ConfigMultisigProposal type");

 }

 return ConfigMultisigProposal.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) } ) }

 static fromBcs( data: Uint8Array ): ConfigMultisigProposal { return ConfigMultisigProposal.fromFields( ConfigMultisigProposal.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): ConfigMultisigProposal { return ConfigMultisigProposal.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): ConfigMultisigProposal { if (json.$typeName !== ConfigMultisigProposal.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return ConfigMultisigProposal.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): ConfigMultisigProposal { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isConfigMultisigProposal(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a ConfigMultisigProposal object`); } return ConfigMultisigProposal.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): ConfigMultisigProposal { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isConfigMultisigProposal(data.bcs.type)) { throw new Error(`object at is not a ConfigMultisigProposal object`); }

 return ConfigMultisigProposal.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return ConfigMultisigProposal.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<ConfigMultisigProposal> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching ConfigMultisigProposal object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isConfigMultisigProposal(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a ConfigMultisigProposal object`); }

 return ConfigMultisigProposal.fromSuiObjectData( res.data ); }

 }

/* ============================== Invite =============================== */

export function isInvite(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::multisig::Invite`; }

export interface InviteFields { id: ToField<UID>; accountAddr: ToField<"address"> }

export type InviteReified = Reified< Invite, InviteFields >;

export class Invite implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::multisig::Invite`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Invite.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::multisig::Invite`; readonly $typeArgs: []; readonly $isPhantom = Invite.$isPhantom;

 readonly id: ToField<UID>; readonly accountAddr: ToField<"address">

 private constructor(typeArgs: [], fields: InviteFields, ) { this.$fullTypeName = composeSuiType( Invite.$typeName, ...typeArgs ) as `${typeof PKG_V1}::multisig::Invite`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.accountAddr = fields.accountAddr; }

 static reified( ): InviteReified { return { typeName: Invite.$typeName, fullTypeName: composeSuiType( Invite.$typeName, ...[] ) as `${typeof PKG_V1}::multisig::Invite`, typeArgs: [ ] as [], isPhantom: Invite.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Invite.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Invite.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Invite.fromBcs( data, ), bcs: Invite.bcs, fromJSONField: (field: any) => Invite.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Invite.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Invite.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Invite.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Invite.fetch( client, id, ), new: ( fields: InviteFields, ) => { return new Invite( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Invite.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Invite>> { return phantom(Invite.reified( )); } static get p() { return Invite.phantom() }

 static get bcs() { return bcs.struct("Invite", {

 id: UID.bcs, account_addr: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), })

}) };

 static fromFields( fields: Record<string, any> ): Invite { return Invite.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id), accountAddr: decodeFromFields("address", fields.account_addr) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Invite { if (!isInvite(item.type)) { throw new Error("not a Invite type");

 }

 return Invite.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), accountAddr: decodeFromFieldsWithTypes("address", item.fields.account_addr) } ) }

 static fromBcs( data: Uint8Array ): Invite { return Invite.fromFields( Invite.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,accountAddr: this.accountAddr,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Invite { return Invite.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id), accountAddr: decodeFromJSONField("address", field.accountAddr) } ) }

 static fromJSON( json: Record<string, any> ): Invite { if (json.$typeName !== Invite.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Invite.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Invite { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isInvite(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Invite object`); } return Invite.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Invite { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isInvite(data.bcs.type)) { throw new Error(`object at is not a Invite object`); }

 return Invite.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Invite.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Invite> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Invite object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isInvite(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Invite object`); }

 return Invite.fromSuiObjectData( res.data ); }

 }

/* ============================== Member =============================== */

export function isMember(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::multisig::Member`; }

export interface MemberFields { addr: ToField<"address">; weight: ToField<"u64">; roles: ToField<VecSet<String>> }

export type MemberReified = Reified< Member, MemberFields >;

export class Member implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::multisig::Member`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Member.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::multisig::Member`; readonly $typeArgs: []; readonly $isPhantom = Member.$isPhantom;

 readonly addr: ToField<"address">; readonly weight: ToField<"u64">; readonly roles: ToField<VecSet<String>>

 private constructor(typeArgs: [], fields: MemberFields, ) { this.$fullTypeName = composeSuiType( Member.$typeName, ...typeArgs ) as `${typeof PKG_V1}::multisig::Member`; this.$typeArgs = typeArgs;

 this.addr = fields.addr;; this.weight = fields.weight;; this.roles = fields.roles; }

 static reified( ): MemberReified { return { typeName: Member.$typeName, fullTypeName: composeSuiType( Member.$typeName, ...[] ) as `${typeof PKG_V1}::multisig::Member`, typeArgs: [ ] as [], isPhantom: Member.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Member.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Member.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Member.fromBcs( data, ), bcs: Member.bcs, fromJSONField: (field: any) => Member.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Member.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Member.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Member.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Member.fetch( client, id, ), new: ( fields: MemberFields, ) => { return new Member( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Member.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Member>> { return phantom(Member.reified( )); } static get p() { return Member.phantom() }

 static get bcs() { return bcs.struct("Member", {

 addr: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }), weight: bcs.u64(), roles: VecSet.bcs(String.bcs)

}) };

 static fromFields( fields: Record<string, any> ): Member { return Member.reified( ).new( { addr: decodeFromFields("address", fields.addr), weight: decodeFromFields("u64", fields.weight), roles: decodeFromFields(VecSet.reified(String.reified()), fields.roles) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Member { if (!isMember(item.type)) { throw new Error("not a Member type");

 }

 return Member.reified( ).new( { addr: decodeFromFieldsWithTypes("address", item.fields.addr), weight: decodeFromFieldsWithTypes("u64", item.fields.weight), roles: decodeFromFieldsWithTypes(VecSet.reified(String.reified()), item.fields.roles) } ) }

 static fromBcs( data: Uint8Array ): Member { return Member.fromFields( Member.bcs.parse(data) ) }

 toJSONField() { return {

 addr: this.addr,weight: this.weight.toString(),roles: this.roles.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Member { return Member.reified( ).new( { addr: decodeFromJSONField("address", field.addr), weight: decodeFromJSONField("u64", field.weight), roles: decodeFromJSONField(VecSet.reified(String.reified()), field.roles) } ) }

 static fromJSON( json: Record<string, any> ): Member { if (json.$typeName !== Member.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Member.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Member { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isMember(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Member object`); } return Member.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Member { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isMember(data.bcs.type)) { throw new Error(`object at is not a Member object`); }

 return Member.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Member.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Member> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Member object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isMember(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Member object`); }

 return Member.fromSuiObjectData( res.data ); }

 }

/* ============================== Multisig =============================== */

export function isMultisig(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::multisig::Multisig`; }

export interface MultisigFields { members: ToField<Vector<Member>>; global: ToField<"u64">; roles: ToField<Vector<Role>> }

export type MultisigReified = Reified< Multisig, MultisigFields >;

export class Multisig implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::multisig::Multisig`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Multisig.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::multisig::Multisig`; readonly $typeArgs: []; readonly $isPhantom = Multisig.$isPhantom;

 readonly members: ToField<Vector<Member>>; readonly global: ToField<"u64">; readonly roles: ToField<Vector<Role>>

 private constructor(typeArgs: [], fields: MultisigFields, ) { this.$fullTypeName = composeSuiType( Multisig.$typeName, ...typeArgs ) as `${typeof PKG_V1}::multisig::Multisig`; this.$typeArgs = typeArgs;

 this.members = fields.members;; this.global = fields.global;; this.roles = fields.roles; }

 static reified( ): MultisigReified { return { typeName: Multisig.$typeName, fullTypeName: composeSuiType( Multisig.$typeName, ...[] ) as `${typeof PKG_V1}::multisig::Multisig`, typeArgs: [ ] as [], isPhantom: Multisig.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Multisig.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Multisig.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Multisig.fromBcs( data, ), bcs: Multisig.bcs, fromJSONField: (field: any) => Multisig.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Multisig.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Multisig.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Multisig.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Multisig.fetch( client, id, ), new: ( fields: MultisigFields, ) => { return new Multisig( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Multisig.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Multisig>> { return phantom(Multisig.reified( )); } static get p() { return Multisig.phantom() }

 static get bcs() { return bcs.struct("Multisig", {

 members: bcs.vector(Member.bcs), global: bcs.u64(), roles: bcs.vector(Role.bcs)

}) };

 static fromFields( fields: Record<string, any> ): Multisig { return Multisig.reified( ).new( { members: decodeFromFields(reified.vector(Member.reified()), fields.members), global: decodeFromFields("u64", fields.global), roles: decodeFromFields(reified.vector(Role.reified()), fields.roles) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Multisig { if (!isMultisig(item.type)) { throw new Error("not a Multisig type");

 }

 return Multisig.reified( ).new( { members: decodeFromFieldsWithTypes(reified.vector(Member.reified()), item.fields.members), global: decodeFromFieldsWithTypes("u64", item.fields.global), roles: decodeFromFieldsWithTypes(reified.vector(Role.reified()), item.fields.roles) } ) }

 static fromBcs( data: Uint8Array ): Multisig { return Multisig.fromFields( Multisig.bcs.parse(data) ) }

 toJSONField() { return {

 members: fieldToJSON<Vector<Member>>(`vector<${Member.$typeName}>`, this.members),global: this.global.toString(),roles: fieldToJSON<Vector<Role>>(`vector<${Role.$typeName}>`, this.roles),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Multisig { return Multisig.reified( ).new( { members: decodeFromJSONField(reified.vector(Member.reified()), field.members), global: decodeFromJSONField("u64", field.global), roles: decodeFromJSONField(reified.vector(Role.reified()), field.roles) } ) }

 static fromJSON( json: Record<string, any> ): Multisig { if (json.$typeName !== Multisig.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Multisig.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Multisig { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isMultisig(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Multisig object`); } return Multisig.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Multisig { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isMultisig(data.bcs.type)) { throw new Error(`object at is not a Multisig object`); }

 return Multisig.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Multisig.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Multisig> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Multisig object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isMultisig(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Multisig object`); }

 return Multisig.fromSuiObjectData( res.data ); }

 }