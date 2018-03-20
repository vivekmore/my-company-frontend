import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatInputModule
} from '@angular/material';
import { BlogPublishComponent } from './blog-publish/blog-publish.component';

import { BlogUnPublishComponent } from './blog-unpublish/blog-unpublish.component';
import { BlogComponent } from './blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogNewComponent } from './blog-new/blog-new.component';
import { BlogService } from './shared/blog.service';
import { ReactiveFormsModule } from '@angular/forms';
import { PresentationalComponentsModule } from '@my-company-frontend/presentational-components';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@my-company-frontend/shared/src/guards/auth-guard.service';
import { AdminAuthGuard } from '@my-company-frontend/shared/src/guards/admin-auth-guard.service';
import { UserService } from '@my-company-frontend/shared/src/user.service';
import { JwtHelperService, JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { TOKEN_NAME } from '@my-company-frontend/shared/src/auth.constant';
import { EventManager } from '@my-company-frontend/shared/src/event-manager.service';

function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return localStorage.getItem(TOKEN_NAME);
    },
    throwNoTokenError: false,
    whitelistedDomains: ['localhost:8080', 'stage-my-company-monolith.cfapps.io', 'prod-my-company-monolith.cfapps.io']
  };
}

export const blogRoutes: Routes = [
  {
    path: '',
    component: BlogComponent,
    data: {
      breadcrumb: 'blog'
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: BlogListComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: ':id',
            component: BlogDetailComponent,
            data: {
              breadcrumb: 'detail'
            },
            canActivate: [AuthGuard],
            children: [
              {
                path: 'action/publish',
                component: BlogPublishComponent,
                data: {
                  breadcrumb: 'publish'
                },
                canActivate: [AuthGuard, AdminAuthGuard]
              },
              {
                path: 'action/unpublish',
                component: BlogUnPublishComponent,
                data: {
                  breadcrumb: 'unpublish'
                },
                canActivate: [AuthGuard, AdminAuthGuard]
              }
            ]
          },
          {
            path: 'action/new',
            component: BlogNewComponent,
            data: {
              breadcrumb: 'new'
            },
            canActivate: [AuthGuard, AdminAuthGuard]
          }
        ]
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PresentationalComponentsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      }
    })
  ],
  declarations: [
    BlogComponent,
    BlogDetailComponent,
    BlogListComponent,
    BlogNewComponent,
    BlogPublishComponent,
    BlogUnPublishComponent
  ],
  providers: [EventManager, BlogService, AuthGuard, AdminAuthGuard, UserService, JwtHelperService]
  
})
export class BlogModule {}