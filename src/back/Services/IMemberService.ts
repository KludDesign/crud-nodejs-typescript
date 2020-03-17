import IMember from "../Models/IMember"

/**
 * Abstraction of member service.
 */
export default interface IMemberService {

    /**
     * Gets all members of repository
     */
    getAll(): Promise<IMember[]>;

    /**
     * Gets member by id or null if does not exists.
     * @param id The id of the wanted member.
     */
    getByIdOrNull(id: number): Promise<IMember | null>;

    /**
     * Create a new member in repository and returns its id.
     * @param member The member to add
     */
    create(member: IMember): Promise<number>;

    /**
     * Delete the member with the specified id
     * @param id The if of member to remove
     * @returns True if member existed, false otherwise
     */
    delete(id: number): Promise<boolean>;

    /**
     * Modify the member email with the specified id
     * @param id The if of member to remove
     * @param email New email to replace
     */
    put(id: number, email: string): Promise<boolean>;

}