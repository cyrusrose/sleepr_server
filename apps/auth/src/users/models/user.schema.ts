import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument } from '@app/common'

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop({ unique: true })
  email: string

  @Prop()
  password: string

  @Prop()
  roles?: string[]
}

export const UserSchema = SchemaFactory.createForClass(UserDocument)
