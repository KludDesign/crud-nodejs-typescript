<template>
<section>
        <div class="columns is-multiline">

            <!-- The column with card for each member -->
            <div class="column is-2" v-for="(member, index) in members" :key="member.id">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Member #{{member.id}}
                        </p>
                    </header>

                    <div class="card-content">
                        <div class="content">
                            <b-field label="Email">
                                <b-input type="email" v-model="member.email"></b-input>
                            </b-field>
                            <b-field label="Password">
                                <b-input type="password" value="******" readonly></b-input>
                            </b-field>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item" @click="updateMember(member)">Save</a>
                        <a href="#" class="card-footer-item" @click="removeMember(member, index)">Delete</a>
                    </footer>
                </div>
            </div>
            
            <!-- The column with card to create a new member -->
            <div class="column is-2">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Create new member
                        </p>
                    </header>

                    <div class="card-content">
                        <div class="content">
                            <b-field label="Email">
                                <b-input type="email" v-model="newMember.email"></b-input>
                            </b-field>
                            <b-field label="Password">
                                <b-input type="password" v-model="newMember.password"></b-input>
                            </b-field>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item" @click="addNewMember">Add</a>
                    </footer>
                </div>
            </div>


        </div>
</section>

</template>

<script lang="ts">

import Vue from "vue"
import Component from "vue-class-component"
import Axios, { AxiosResponse } from "axios"
import Buefy from "buefy"


/** Member DTO to deal with backend API */
type MemberDto = { id: number, email: string, password: string };


@Component
export default class App extends Vue { 

    members: MemberDto [] = [];

    newMember: MemberDto = { id: 0, email: "", password: "" };

    /**
     * Executed when component is mounted in browser
     */
    async mounted() {
        const resp = await Axios.get<MemberDto[]>("/api/member/");
        this.members = resp.data;
    }

    /**
     * The add member click handler
     */
    async addNewMember() {
        if (this.newMember.email !== "" && this.newMember.password !== "") {

            let isEmailExist = this.members.find(member => member.email === this.newMember.email)

            if (isEmailExist) {
                this.$buefy.toast.open({duration: 3000, message: "Email member already exist !", type: "is-danger" });
            }
            else {
                const resp = await Axios.post<number>("/api/member/", { email: this.newMember.email, password: this.newMember.password });
                if (resp.status === 200) {
                    this.members.push({
                        id: resp.data,
                        email: this.newMember.email,
                        password: "******"
                    });
    
                    this.newMember.email = "";
                    this.newMember.password = "";
    
                    this.$buefy.toast.open({duration: 3000, message: `New member #${resp.data} was created`, type: "is-success" });
                }
                else {
                    this.$buefy.toast.open({duration: 3000, message: `Error code ${resp.status} : ${resp.statusText}`, type: "is-danger" });
                }
            }
        }
        else {
            this.$buefy.toast.open({duration: 3000, message: "Email and password are required !", type: "is-danger" });
        }
    }

    /**
     * Update member handler
     */
    async updateMember(member: MemberDto) {
        if (member.email !== "") {

            let isEmailExist = this.members.find(m => m.id !== member.id ? m.email === member.email : '')

            if (isEmailExist) {
                this.$buefy.toast.open({duration: 3000, message: "Email member already exist !", type: "is-danger" });
            }
            else {
                const resp = await Axios.put<boolean>(`/api/member/${member.id}`, { email: member.email });

                if (resp.status === 200) {
                    this.$buefy.toast.open({duration: 3000, message: `You update you email with ${member.email}`, type: "is-success" });
                }
                else {
                    this.$buefy.toast.open({duration: 3000, message: "Error while trying to update", type: "is-danger" });
                }
            }
        }
        else {
            this.$buefy.toast.open({duration: 3000, message: "Email and password are required !", type: "is-danger" });
        }
    }

    /**
     * Remove member handler
     */
    async removeMember(member: MemberDto, index: number) {
        this.$buefy.dialog.confirm({ 
            title: "Remove member ...", 
            message: `Do you want to remove Member #${member.id} ?`,
            cancelText: 'No',
            confirmText: 'Yes',
            type: "is-danger",

            onConfirm: async () => { 
                const resp = await Axios.delete<boolean>(`/api/member/${member.id}`);

                if (resp.status === 200) {
                    this.$buefy.toast.open({duration: 3000, message: "TODO : implement member delete here !", type: "is-warning" });
                    this.members.splice(index, 1) 
                }
                else {
                    this.$buefy.toast.open({duration: 3000, message: "Error while trying to delete", type: "is-danger" });
                }
                
            } 

        })
    }

}


</script>