<template>
  <div class="flex h-screen bg-background font-sans text-text">
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-full flex-col">
        <div class="flex h-20 items-center justify-center border-b border-slate-700 bg-slate-900 shadow-xl">
            <h1 class="text-2xl font-bold tracking-wider text-accent">PURPLE DOG</h1>
        </div>

        <nav class="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            <router-link
              to="/admin"
              class="flex items-center rounded-lg px-4 py-3 transition-colors duration-200 hover:bg-slate-800 hover:text-accent"
              active-class="bg-slate-800 text-accent ring-1 ring-slate-700 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </router-link>

            <router-link to="/admin/users" 
               class="flex items-center rounded-lg px-4 py-3 transition-colors duration-200 hover:bg-slate-800 hover:text-white"
               active-class="bg-slate-800 text-accent ring-1 ring-slate-700 shadow-lg text-white"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Utilisateurs
            </router-link>

            <router-link to="/admin/objets" 
               class="flex items-center rounded-lg px-4 py-3 transition-colors duration-200 hover:bg-slate-800 hover:text-white"
               active-class="bg-slate-800 text-accent ring-1 ring-slate-700 shadow-lg text-white"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Objets
            </router-link>

            <router-link to="/admin/finance" 
               class="flex items-center rounded-lg px-4 py-3 transition-colors duration-200 hover:bg-slate-800 hover:text-white"
               active-class="bg-slate-800 text-accent ring-1 ring-slate-700 shadow-lg text-white"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Finance
            </router-link>
            <a href="#" class="flex items-center rounded-lg px-4 py-3 text-slate-400 transition-colors duration-200 hover:bg-slate-800 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Enchères
            </a>
             <a href="#" class="flex items-center rounded-lg px-4 py-3 text-slate-400 transition-colors duration-200 hover:bg-slate-800 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Paramètres
            </a>
        </nav>

        <div class="border-t border-slate-700 bg-slate-900 p-4">
            <div class="flex items-center">
                 <div class="h-10 w-10 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center text-accent font-bold">
                    A
                 </div>
                 <div class="ml-3">
                    <p class="text-sm font-medium text-white">Admin User</p>
                    <p class="text-xs text-slate-400">admin@purpledog.com</p>
                 </div>
            </div>
             <button class="mt-4 w-full flex items-center justify-center py-2 px-4 border border-slate-600 rounded shadow-sm text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">
                Déconnexion
             </button>
        </div>
      </div>
    </aside>

    <div class="flex flex-1 flex-col overflow-hidden">
        <header class="flex items-center justify-between bg-white px-6 py-4 shadow-sm lg:hidden">
            <h1 class="text-xl font-bold text-slate-800">Admin</h1>
            <button @click="toggleSidebar" class="text-slate-500 hover:text-slate-700 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </header>

        <div 
            v-if="isSidebarOpen" 
            @click="toggleSidebar" 
            class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
        ></div>

        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
            <router-view></router-view>
        </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>
