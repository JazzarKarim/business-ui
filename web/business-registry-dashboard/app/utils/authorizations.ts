/**
 * Whether the specified action is authorized for the current user.
 * Ultimately we'll just check if the auth roles includes the specified action.
 * @returns True or False
 */
export function IsAuthorized (action: AuthorizedActions): boolean {
  switch (true) {
    case isBusinessRegistryStaff(): return BusinessRegistryStaffRoles.includes(action)
    case isMaximusStaff(): return MaximusStaffRoles.includes(action)
    case isContactCentreStaff(): return ContactCentreStaffRoles.includes(action)
    case isSbcFieldOfficeStaff(): return SbcFieldOfficeStaffRoles.includes(action)
    default: return DefaultRoles.includes(action)
  }
}

/**
 * Whether the user is Business Registry Staff.
 * Ultimately we won't need this function and we'll just check auth roles for everything.
 */
function isBusinessRegistryStaff (): boolean {
  const affStore = useAffiliationsStore()
  return affStore.authorizations?.roles?.includes(AuthorizationRoles.STAFF) || false
}

/**
 * Whether the user is Maximus Staff.
 * Ultimately we won't need this function and we'll just check auth roles for everything.
 */
function isMaximusStaff (): boolean {
  const affStore = useAffiliationsStore()
  return affStore.authorizations?.roles?.includes(AuthorizationRoles.MAXIMUS_STAFF) || false
}

/**
 * Whether the user is Contact Centre Staff.
 * Ultimately we won't need this function and we'll just check auth roles for everything.
 */
function isContactCentreStaff (): boolean {
  const affStore = useAffiliationsStore()
  return affStore.authorizations?.roles?.includes(AuthorizationRoles.CONTACT_CENTRE_STAFF) || false
}

/**
 * Whether the user is SBC Field Office Staff.
 * Ultimately we won't need this function and we'll just check auth roles for everything.
 */
function isSbcFieldOfficeStaff (): boolean {
  const affStore = useAffiliationsStore()
  return affStore.authorizations?.roles?.includes(AuthorizationRoles.SBC_STAFF) || false
}

/**
 * The roles if the user is Business Registry Staff.
 * Ultimately we won't need this list and we'll just check auth roles for everything.
 */
const BusinessRegistryStaffRoles = [
  AuthorizedActions.ADD_ENTITY_NO_AUTHENTICATION,
  AuthorizedActions.STAFF_DASHBOARD,
  AuthorizedActions.MANAGE_OTHER_ORGANIZATION,
  AuthorizedActions.RESTORE_OR_REINSTATE
]

/**
 * The roles if the user is Maximus Staff.
 * Ultimately we won't need this list and we'll just check auth roles for everything.
 */
const MaximusStaffRoles = [] as AuthorizedActions[]

/**
 * The roles if the user is Contact Centre Staff.
 * Ultimately we won't need this list and we'll just check auth roles for everything.
 */
const ContactCentreStaffRoles = [] as AuthorizedActions[]

/**
 * The roles if the user is SBC Field Office Staff (aka SBC Staff Tier 2).
 * Ultimately we won't need this list and we'll just check auth roles for everything.
 */
const SbcFieldOfficeStaffRoles = [
  AuthorizedActions.ADD_ENTITY_NO_AUTHENTICATION,
  AuthorizedActions.STAFF_DASHBOARD,
  AuthorizedActions.MANAGE_OTHER_ORGANIZATION,
  AuthorizedActions.RESTORE_OR_REINSTATE
]

/**
 * The roles if the user is none of the other types.
 * Ultimately we won't need this list and we'll just check auth roles for everything.
 */
const DefaultRoles = [] as AuthorizedActions[]
