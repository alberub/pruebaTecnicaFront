import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './modules/home/pages/home/home.component';

const routes: Routes = [

    { 
        path: 'home', 
        component: HomeComponent, 
        loadChildren: () => import('./modules/home/pages/home.module').then(m => m.HomeModule)    
    },

    { 
        path: '**', 
        component: HomeComponent 
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
