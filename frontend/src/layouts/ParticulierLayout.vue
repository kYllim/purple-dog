<template>
  <div class="min-h-screen bg-background text-text flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md p-6">
      <nav class="space-y-4">
        <RouterLink to="/particulier/vendre" class="block">Vendre un objet</RouterLink>
        <RouterLink to="/particulier/mes-objets" class="block">Mes objets</RouterLink>
        <RouterLink to="/particulier/profil" class="block">Mon profil</RouterLink>
        <RouterLink to="/particulier/avis" class="block">Donner un avis</RouterLink>
      </nav>
    </aside>

    <!-- Contenu -->
    <main class="flex-1 p-10">
      <slot />
    </main>
  </div>
</template>
