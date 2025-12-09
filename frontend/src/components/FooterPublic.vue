<template>
  <footer class="bg-background text-text border-t border-slate-200 pt-16 pb-8">
    <div class="max-w-[1920px] mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        <!-- Brand / Logo -->
        <div class="space-y-6">
          <div class="text-2xl font-black tracking-tighter uppercase">
            Purple<span class="text-accent">Dog</span>
          </div>
          <p class="text-slate-500 text-sm leading-relaxed max-w-xs">
            Maison de vente aux enchères de prestige. 
            L'excellence et la passion au service de vos biens d'exception depuis 1985.
          </p>
          <!-- Social Icons -->
          <div class="flex space-x-4">
            <a href="#" class="p-2 bg-slate-100 hover:bg-accent hover:text-white rounded-full transition-colors text-slate-600">
               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" /></svg>
            </a>
            <a href="#" class="p-2 bg-slate-100 hover:bg-accent hover:text-white rounded-full transition-colors text-slate-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.024-.047 1.379-.06 3.808-.06.772 0 2.16.096 2.16.096zM12.001 5.925c-3.355 0-6.075 2.719-6.075 6.075 0 3.356 2.72 6.075 6.075 6.075 3.356 0 6.075-2.719 6.075-6.075 0-3.356-2.719-6.075-6.075-6.075zm0 10.02a3.945 3.945 0 110-7.89 3.945 3.945 0 010 7.89zm5.823-8.87a1.055 1.055 0 11-2.11 0 1.055 1.055 0 012.11 0z" clip-rule="evenodd" /></svg>
            </a>
            <a href="#" class="p-2 bg-slate-100 hover:bg-accent hover:text-white rounded-full transition-colors text-slate-600">
               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd" /></svg>
            </a>
            <a href="#" class="p-2 bg-slate-100 hover:bg-accent hover:text-white rounded-full transition-colors text-slate-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.487-.695-2.435-2.878-2.435-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.93 0 4.136-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" /></svg>
            </a>
            <a href="#" class="p-2 bg-slate-100 hover:bg-accent hover:text-white rounded-full transition-colors text-slate-600">
               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
            </a>
          </div>
        </div>

        <!-- Links Column 1 -->
        <div>
          <h3 class="font-bold text-lg mb-6 text-text">Société</h3>
          <ul class="space-y-4">
            <li><router-link to="/about" class="text-slate-500 hover:text-accent transition-colors">Qui sommes-nous ?</router-link></li>
          </ul>
        </div>

        <!-- Links Column 2 -->
        <div>
          <h3 class="font-bold text-lg mb-6 text-text">Informations</h3>
          <ul class="space-y-4">
            <li><router-link to="/legal" class="text-slate-500 hover:text-accent transition-colors">Mentions légales</router-link></li>
            <li><router-link to="/privacy" class="text-slate-500 hover:text-accent transition-colors">Politique de confidentialité</router-link></li>
            <li><router-link to="/terms" class="text-slate-500 hover:text-accent transition-colors">CGV / CGU</router-link></li>
            <li><router-link to="/faq" class="text-slate-500 hover:text-accent transition-colors">FAQ</router-link></li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div>
           <h3 class="font-bold text-lg mb-6 text-text">Contact</h3>
           <p class="text-slate-500 mb-6">Une question ? Une estimation ?</p>
           <router-link to="/contact" class="inline-block px-8 py-3 bg-text text-white font-bold uppercase tracking-widest text-xs hover:bg-accent transition-colors duration-300">
             Contactez-nous
           </router-link>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
        <p>&copy; 2025 PurpleDog. Tous droits réservés.</p>
        <div class="flex space-x-6 mt-4 md:mt-0">
        </div>
      </div>
    </div>
  </footer>
</template>
