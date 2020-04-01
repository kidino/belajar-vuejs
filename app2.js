Vue.component('user-form', {
    template: `                <div class="card" id="user-form">
                    <div class="card-body">
                        <h4 v-if="user.id == null" class="card-title">Add New User</h4>
                        <h4 v-else class="card-title">Update User {{user.name}}</h4>

                        <form role="form" @submit.prevent="onSubmit">
                            <div class="form-group">
                                <label for="input-id">ID</label>
                                <input type="number" class="form-control" id="input-id" readonly="readonly" :value="user.id" ref="id"> 
                            </div>
                            <div class="form-group">
                                <label for="input-name">Name</label>
                                <input type="text" class="form-control" id="input-name" :value="user.name" ref="name">
                            </div>
                            <div class="form-group">
                                <label for="input-username">Username</label>
                                <input type="text" class="form-control" id="input-username" :value="user.username" ref="username">
                            </div>
                            <div class="form-group">
                                <label for="input-username">Age</label>
                                <input type="number" class="form-control" id="input-age" :value="user.age" ref="age">
                            </div>
                            <div class="form-group">
                                <label for="input-status">Status</label>
                                <select class="form-control" id="input-status" :value="user.status" ref="status">
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>                                                                                          
                                        </select>
                            </div>
                            <button v-if="user.id == null" type="submit" class="btn btn-primary">Save</button>
                            <button v-else type="submit" class="btn btn-primary">Update</button>
                            <button type="button" class="btn btn-info" @click="resetForm">Cancel</button>
                        </form>
                    </div>
                </div>
`,
    props: {
        user: Object
    },
    methods: {
        onSubmit() {
            let form_user = {
                id: this.$refs.id.value,
                name: this.$refs.name.value,
                age: this.$refs.age.value,
                username: this.$refs.username.value,
                status: this.$refs.status.value
            }
            this.$emit('form-user-submit', form_user)
        },
        resetForm() {
            this.$emit('form-reset')
        }
    }
});

Vue.component('user-table', {
    props: {
        users: { type: Array, default: [] }
    },
    template: `                <table id="user-table" class="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Age</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in users" :class="{inactive: !isActive(index)}" :key="user.id" @click="onClick(index)">
                            <td>{{user.id}}</td>
                            <td>{{user.name}}</td>
                            <td>{{user.username}}</td>
                            <td>{{user.age}}</td>
                            <td>{{user.status}}</td>
                            <td><button class="btn btn-sm btn-danger" @click="deleteClick(index)">&times;</button></td>
                        </tr>
                    </tbody>
                </table>
`,
    data() {
        return {};
    },
    methods: {
        isActive(user_index) {
            return (this.users[user_index].status == 'Active')
        },
        onClick(index) {
            console.log(index);
            let user = this.users[index]
            this.selectedIndex = index;
            this.$emit('user-clicked', user)
        },
        deleteClick(index) {
            this.selectedIndex = -1;
            this.$emit('delete-clicked', index)
        }
    },
});

var app = new Vue({
    el: '#app',
    data: {
        users: [],
        user: {
            id: null,
            name: null,
            age: null,
            username: null,
            status: null
        }
    },
    created() {
        fetch('http://localhost/bvue/users.php')
            .then(response => response.json())
            .then(json => {
                this.users = json;
            })
    },
    methods: {
        userClicked(user) {
            this.user = user;
        },
        formReset() {
            this.user = {
                id: null,
                name: null,
                age: null,
                username: null,
                status: null
            }
        },
        formSubmitted(form_user) {
            console.log(form_user)

            if (form_user.id != '') {
                this.updateUser(form_user)
            } else {
                this.addUser(form_user)
            }

        },
        deleteUser(index) {
            let dUser = this.users[index];
            let uri_string = this.uriParam({ id: dUser['id'] })
            fetch('users.php?action=delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // this line is important, if this content-type is not set it wont work
                    body: uri_string
                }).then(response => response.json())
                .then(json => {
                    if (json.success) {
                        console.log(json)
                        this.users.splice(index, 1)
                    } else {
                        // error occured
                        console.log(json);
                    }
                })

        },
        addUser(form_user) {
            console.log(form_user)
            let uri_string = this.uriParam(form_user)
            fetch('users.php?action=insert', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // this line is important, if this content-type is not set it wont work
                    body: uri_string
                }).then(response => response.json())
                .then(json => {
                    if (json.success) {
                        console.log(json)
                        this.users.push(json.user)
                        this.formReset()
                    } else {
                        // error occured
                        console.log(json)
                    }
                })

        },
        updateUser(form_user) {
            let uri_string = this.uriParam(form_user)
            console.log(uri_string)

            fetch('users.php?action=update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // this line is important, if this content-type is not set it wont work
                    body: uri_string
                }).then(response => response.json())
                .then(json => {
                    if (json.success) {
                        console.log(json)
                        for (var x in this.users) {
                            if (this.users[x].id == form_user.id) {
                                this.users[x].name = form_user.name
                                this.users[x].username = form_user.username
                                this.users[x].age = form_user.age
                                this.users[x].status = form_user.status
                                console.log('MATCH')
                            }
                        }
                    } else {
                        // error occured
                        console.log(json);
                    }
                })

        },
        uriParam(obj) {
            return Object.keys(obj).map(function(key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
            }).join('&');
        }
    }
})